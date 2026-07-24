import * as usersService from "../services/users.service.js";
import * as statsService from "../services/stats.service.js";
import { sendSuccess, sendError } from "../utils/httpResponse.js";

export const getUserById = async (req, res) => {
  try {
    const user = await usersService.getUserById(req.params.id);
    if (!user) {
      return sendError(res, 404, "L'utilisateur n'a pas été trouvé");
    }
    return sendSuccess(res, 200, "L'utilisateur a été récupéré avec succès", user);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const updatedUser = await usersService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return sendError(res, 404, "L'utilisateur n'a pas été trouvé");
    }
    return sendSuccess(
      res,
      200,
      "L'utilisateur a été mis à jour avec succès",
      updatedUser
    );
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deleted = await usersService.deleteUser(req.params.id);
    if (!deleted) {
      return sendError(res, 404, "L'utilisateur n'a pas été trouvé");
    }
    return sendSuccess(res, 200, "L'utilisateur a été supprimé avec succès");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const getUserStats = async (req, res) => {
  try {
    const stats = await statsService.getUserStats(req.params.id);
    return sendSuccess(
      res,
      200,
      "Statistiques de poids récupérées avec succès",
      stats
    );
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
