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
