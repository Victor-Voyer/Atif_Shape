import * as programService from "../services/program.service.js";
import { sendSuccess, sendError } from "../utils/httpResponse.js";

export const getUserProgram = async (req, res) => {
  try {
    const program = await programService.getUserProgram(req.params.id);
    if (!program) {
      return sendError(res, 404, "L'utilisateur n'a pas été trouvé");
    }
    return sendSuccess(res, 200, "Programme sportif généré avec succès", program);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
