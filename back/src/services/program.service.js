import db from "../models/index.js";
import { getWeightsByUserId } from "./weights.service.js";
import { calculateIMC, getStartingWeight, calculateGoalProgress } from "../utils/weight/algoWeight.js";
import { getAge, getWeekStart } from "../utils/dates/algoDate.js";
import { generateProgramStructure, adjustExerciseForLevel } from "../utils/program/algoProgram.js";

const {
  User,
  Exercise,
  UserProgram,
  ProgramSession,
  ProgramSessionExercise,
  ProgramSessionCompletion,
  sequelize,
  Sequelize,
} = db;

function serializeSavedProgram(userProgram, completedSessionIds) {
  return {
    direction: userProgram.direction,
    level: userProgram.level,
    equipment: userProgram.equipment,
    sessionsPerWeek: userProgram.sessions_per_week,
    focusSummary: userProgram.focus_summary,
    sessions: [...userProgram.sessions]
      .sort((a, b) => a.day_order - b.day_order)
      .map((session) => ({
        id: session.id,
        day: session.day,
        type: session.type,
        focus: session.focus,
        durationMinutes: session.duration_minutes,
        intensity: session.intensity,
        completedThisWeek: completedSessionIds.has(session.id),
        exercises: [...session.exercises]
          .sort((a, b) => a.position - b.position)
          .map((exercise) => ({
            id: exercise.id,
            name: exercise.name_snapshot,
            sets: exercise.sets,
            reps: exercise.reps,
          })),
      })),
    disclaimer:
      "Programme indicatif généré automatiquement, à adapter selon votre ressenti. Consultez un professionnel de santé avant de débuter une nouvelle activité physique.",
  };
}

async function loadSavedProgram(userId) {
  return UserProgram.findOne({
    where: { user_id: userId },
    include: [
      {
        model: ProgramSession,
        as: "sessions",
        include: [{ model: ProgramSessionExercise, as: "exercises" }],
      },
    ],
  });
}

export async function generateUserProgram(userId, preferences) {
  const [weights, user] = await Promise.all([getWeightsByUserId(userId), User.findByPk(userId)]);

  if (!user) return null;

  const startingWeight = getStartingWeight(weights);
  const latestWeightRow =
    weights.length > 0
      ? [...weights].sort((a, b) => new Date(b.measured_at) - new Date(a.measured_at))[0]
      : null;

  let imcCategory = null;
  if (user.height && latestWeightRow?.weight) {
    try {
      imcCategory = calculateIMC(Number(latestWeightRow.weight), Number(user.height)).category;
    } catch {
      imcCategory = null;
    }
  }

  const goal =
    user.target_weight != null && latestWeightRow
      ? calculateGoalProgress(startingWeight, latestWeightRow.weight, user.target_weight)
      : null;

  const structure = generateProgramStructure({
    direction: goal?.direction ?? null,
    imcCategory,
    age: getAge(user.birthdate),
    sessionsPerWeek: preferences?.sessionsPerWeek,
    equipment: preferences?.equipment,
    level: preferences?.level,
  });

  const sessionsWithExercises = await Promise.all(
    structure.sessions.map(async (session) => {
      const candidates = await Exercise.findAll({
        where: { category: session.type, focus: session.focus, equipment: structure.equipment },
        order: sequelize.random(),
        limit: session.exerciseSlots,
      });
      const exercises = candidates.map((candidate) =>
        adjustExerciseForLevel(candidate.get({ plain: true }), {
          level: structure.level,
          durationMinutes: session.durationMinutes,
        })
      );
      return { ...session, exercises };
    })
  );

  await sequelize.transaction(async (transaction) => {
    await UserProgram.destroy({ where: { user_id: userId }, transaction });

    const userProgram = await UserProgram.create(
      {
        user_id: userId,
        direction: structure.direction,
        equipment: structure.equipment,
        level: structure.level,
        sessions_per_week: structure.sessionsPerWeek,
        focus_summary: structure.focusSummary,
      },
      { transaction }
    );

    for (const [index, session] of sessionsWithExercises.entries()) {
      const programSession = await ProgramSession.create(
        {
          user_program_id: userProgram.id,
          day: session.day,
          day_order: index,
          type: session.type,
          focus: session.focus,
          duration_minutes: session.durationMinutes,
          intensity: session.intensity,
        },
        { transaction }
      );

      await ProgramSessionExercise.bulkCreate(
        session.exercises.map((exercise, position) => ({
          program_session_id: programSession.id,
          exercise_id: exercise.exerciseId,
          name_snapshot: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          position,
        })),
        { transaction }
      );
    }
  });

  return getUserProgram(userId);
}

export async function getUserProgram(userId) {
  const userProgram = await loadSavedProgram(userId);
  if (!userProgram) return null;

  const weekStart = getWeekStart();
  const sessionIds = userProgram.sessions.map((session) => session.id);
  const completions = sessionIds.length
    ? await ProgramSessionCompletion.findAll({
        where: { program_session_id: sessionIds, week_start_date: weekStart },
      })
    : [];
  const completedSessionIds = new Set(completions.map((completion) => completion.program_session_id));

  return serializeSavedProgram(userProgram, completedSessionIds);
}

async function findOwnedSession(userId, sessionId) {
  const session = await ProgramSession.findByPk(sessionId, {
    include: [
      { model: UserProgram, as: "user_program" },
      { model: ProgramSessionExercise, as: "exercises" },
    ],
  });

  if (!session || session.user_program.user_id !== Number(userId)) {
    return null;
  }

  return session;
}

export async function toggleSessionCompletion(userId, sessionId) {
  const session = await findOwnedSession(userId, sessionId);
  if (!session) return null;

  const weekStart = getWeekStart();
  const existing = await ProgramSessionCompletion.findOne({
    where: { program_session_id: sessionId, week_start_date: weekStart },
  });

  if (existing) {
    await existing.destroy();
    return { completedThisWeek: false };
  }

  await ProgramSessionCompletion.create({ program_session_id: sessionId, week_start_date: weekStart });
  return { completedThisWeek: true };
}

export async function swapProgramExercise(userId, sessionId, sessionExerciseId) {
  const session = await findOwnedSession(userId, sessionId);
  if (!session) return { status: "not_found" };

  const target = session.exercises.find((exercise) => exercise.id === Number(sessionExerciseId));
  if (!target) return { status: "not_found" };

  const excludedIds = session.exercises.map((exercise) => exercise.exercise_id).filter(Boolean);

  const candidate = await Exercise.findOne({
    where: {
      category: session.type,
      focus: session.focus,
      equipment: session.user_program.equipment,
      id: { [Sequelize.Op.notIn]: excludedIds.length ? excludedIds : [0] },
    },
    order: sequelize.random(),
  });

  if (!candidate) return { status: "exhausted" };

  const adjusted = adjustExerciseForLevel(candidate.get({ plain: true }), {
    level: session.user_program.level,
    durationMinutes: session.duration_minutes,
  });

  await target.update({
    exercise_id: adjusted.exerciseId,
    name_snapshot: adjusted.name,
    sets: adjusted.sets,
    reps: adjusted.reps,
  });

  return {
    status: "ok",
    exercise: { id: target.id, name: target.name_snapshot, sets: target.sets, reps: target.reps },
  };
}

export async function excludeProgramExercise(userId, sessionId, sessionExerciseId) {
  const session = await findOwnedSession(userId, sessionId);
  if (!session) return { status: "not_found" };

  const target = session.exercises.find((exercise) => exercise.id === Number(sessionExerciseId));
  if (!target) return { status: "not_found" };

  if (session.exercises.length <= 1) {
    return { status: "last_exercise" };
  }

  await target.destroy();
  return { status: "ok" };
}
