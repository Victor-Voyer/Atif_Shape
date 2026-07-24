import * as programService from "../services/program.service.js";
import { sendSuccess, sendError } from "../utils/httpResponse.js";

export const generateUserProgram = async (req, res) => {
  try {
    const { sessionsPerWeek, equipment, level } = req.body;
    const program = await programService.generateUserProgram(req.params.id, {
      sessionsPerWeek,
      equipment,
      level,
    });
    if (!program) {
      return sendError(res, 404, "L'utilisateur n'a pas été trouvé");
    }
    return sendSuccess(res, 200, "Programme sportif généré avec succès", program);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const getUserProgram = async (req, res) => {
  try {
    const program = await programService.getUserProgram(req.params.id);
    return sendSuccess(res, 200, "Programme sportif récupéré avec succès", program);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const toggleSessionCompletion = async (req, res) => {
  try {
    const result = await programService.toggleSessionCompletion(req.params.id, req.params.sessionId);
    if (!result) {
      return sendError(res, 404, "Séance introuvable");
    }
    return sendSuccess(res, 200, "Statut de la séance mis à jour", result);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const swapProgramExercise = async (req, res) => {
  try {
    const result = await programService.swapProgramExercise(
      req.params.id,
      req.params.sessionId,
      req.params.exerciseId
    );
    if (result.status === "not_found") {
      return sendError(res, 404, "Exercice introuvable");
    }
    if (result.status === "exhausted") {
      return sendError(res, 422, "Plus aucune alternative disponible pour cet exercice");
    }
    return sendSuccess(res, 200, "Exercice remplacé avec succès", result.exercise);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const excludeProgramExercise = async (req, res) => {
  try {
    const result = await programService.excludeProgramExercise(
      req.params.id,
      req.params.sessionId,
      req.params.exerciseId
    );
    if (result.status === "not_found") {
      return sendError(res, 404, "Exercice introuvable");
    }
    if (result.status === "last_exercise") {
      return sendError(res, 422, "Impossible de retirer le dernier exercice de la séance");
    }
    return sendSuccess(res, 200, "Exercice retiré avec succès");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
