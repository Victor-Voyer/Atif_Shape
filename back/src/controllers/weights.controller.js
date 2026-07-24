import * as weightsService from "../services/weights.service.js";
import { sendSuccess, sendError } from "../utils/httpResponse.js";

export const createWeight = async (req, res) => {
  try {
    const { weight } = req.body;
    const userWeight = await weightsService.createWeight(req.params.id, weight);
    return sendSuccess(
      res,
      201,
      "Le poids de l'utilisateur a été créé avec succès",
      userWeight
    );
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
