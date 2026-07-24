import { register, validateCredentials, generateToken } from "../services/auth.service.js";
import { sendSuccess, sendError } from "../utils/httpResponse.js";

export const registerUser = async (req, res) => {
  try {
    const user = await register(req.body);
    return sendSuccess(res, 201, "Utilisateur créé avec succès", user);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await validateCredentials(email, password);
    if (!user) {
      return sendError(res, 401, "Email ou mot de passe incorrect");
    }
    const token = await generateToken(user);
    return sendSuccess(res, 200, "Connexion réussie", user, { token });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
