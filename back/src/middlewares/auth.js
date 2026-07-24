import jwt from "jsonwebtoken";
import { sendError } from "../utils/httpResponse.js";

export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return sendError(res, 401, "Token non trouvé");
  }
  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch {
    return sendError(res, 401, "Token invalide");
  }
};

export const requireSelf = (req, res, next) => {
  if (Number(req.params.id) !== Number(req.user.id)) {
    return sendError(res, 403, "Accès non autorisé à cette ressource");
  }
  return next();
};
