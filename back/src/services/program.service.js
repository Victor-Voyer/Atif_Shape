import db from "../models/index.js";
import { getWeightsByUserId } from "./weights.service.js";
import { calculateIMC, getStartingWeight, calculateGoalProgress } from "../utils/weight/algoWeight.js";
import { getAge } from "../utils/dates/algoDate.js";
import { generateProgram } from "../utils/program/algoProgram.js";

const { User } = db;

export async function generateUserProgram(userId, preferences) {
  const [weights, user] = await Promise.all([
    getWeightsByUserId(userId),
    User.findByPk(userId),
  ]);

  if (!user) return null;

  const startingWeight = getStartingWeight(weights);
  const latestWeightRow =
    weights.length > 0
      ? [...weights].sort(
          (a, b) => new Date(b.measured_at) - new Date(a.measured_at)
        )[0]
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

  return generateProgram({
    direction: goal?.direction ?? null,
    imcCategory,
    age: getAge(user.birthdate),
    sessionsPerWeek: preferences?.sessionsPerWeek,
    equipment: preferences?.equipment,
    level: preferences?.level,
  });
}
