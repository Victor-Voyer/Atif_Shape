import { body, validationResult } from "express-validator";
import db from "../../models/index.js";

const { User } = db;

const MAX_LENGTH = 150;
const MAX_PASSWORD_LENGTH = 300;

// Middleware générique pour renvoyer les erreurs de validation
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Erreurs de validation",
      errors: errors.array().map((err) => err.msg || err),
    });
  }
  next();
};

// Validation à la création d'un utilisateur
export const createUserValidation = [
  body("gender")
    .exists({ checkNull: true })
    .withMessage('gender est obligatoire et doit être "male" ou "female"')
    .bail()
    .isIn(["male", "female"])
    .withMessage('gender est obligatoire et doit être "male" ou "female"'),

  body("username")
    .isString()
    .withMessage("username est obligatoire, il ne doit pas être vide")
    .bail()
    .notEmpty()
    .withMessage("username est obligatoire, il ne doit pas être vide")
    .bail()
    .isLength({ max: MAX_LENGTH })
    .withMessage(`username ne doit pas dépasser ${MAX_LENGTH} caractères`)
    .bail()
    .custom(async (value) => {
      if (!value) return true;
      const existingUsername = await User.findOne({ where: { username: value } });
      if (existingUsername) {
        throw new Error("Ce username est déjà utilisé");
      }
      return true;
    }),

  body("first_name")
    .isString()
    .withMessage("first_name est obligatoire, il ne doit pas être vide")
    .bail()
    .notEmpty()
    .withMessage("first_name est obligatoire, il ne doit pas être vide")
    .bail()
    .isLength({ max: MAX_LENGTH })
    .withMessage(`first_name ne doit pas dépasser ${MAX_LENGTH} caractères`),

  body("last_name")
    .isString()
    .withMessage("last_name est obligatoire, il ne doit pas être vide")
    .bail()
    .notEmpty()
    .withMessage("last_name est obligatoire, il ne doit pas être vide")
    .bail()
    .isLength({ max: MAX_LENGTH })
    .withMessage(`last_name ne doit pas dépasser ${MAX_LENGTH} caractères`),

  body("age")
    .exists({ checkNull: true })
    .withMessage("age est obligatoire")
    .bail()
    .isISO8601()
    .withMessage("age doit être une date valide"),

  body("height")
    .exists({ checkNull: true })
    .withMessage("height est obligatoire")
    .bail()
    .isInt({ min: 100, max: 300 })
    .withMessage("height doit être un entier compris entre 100 et 300"),

  body("email")
    .isString()
    .withMessage("email est obligatoire, il ne doit pas être vide")
    .bail()
    .notEmpty()
    .withMessage("email est obligatoire, il ne doit pas être vide")
    .bail()
    .isEmail()
    .withMessage("email doit avoir un format valide")
    .bail()
    .custom(async (value) => {
      if (!value) return true;
      const existingEmail = await User.findOne({ where: { email: value } });
      if (existingEmail) {
        throw new Error("Cet email est déjà utilisé");
      }
      return true;
    }),

  body("password")
    .isString()
    .withMessage("password est obligatoire, il ne doit pas être vide")
    .bail()
    .notEmpty()
    .withMessage("password est obligatoire, il ne doit pas être vide")
    .bail()
    .isLength({ min: 8, max: MAX_PASSWORD_LENGTH })
    .withMessage(
      `password doit contenir entre 8 et ${MAX_PASSWORD_LENGTH} caractères`
    ),
];

// Validation à la mise à jour d'un utilisateur
export const updateUserValidation = [
  // Vérifie qu'au moins un champ est fourni
  body()
    .custom((value) => {
      if (!value || typeof value !== "object") {
        throw new Error("Le corps de la requête doit être en JSON !");
      }

      const {
        gender,
        username,
        first_name,
        last_name,
        age,
        height,
        email,
        password,
      } = value;

      if (
        typeof gender === "undefined" &&
        typeof username === "undefined" &&
        typeof first_name === "undefined" &&
        typeof last_name === "undefined" &&
        typeof age === "undefined" &&
        typeof height === "undefined" &&
        typeof email === "undefined" &&
        typeof password === "undefined"
      ) {
        throw new Error(
          "Au moins un champ doit être fourni pour une modification"
        );
      }

      return true;
    }),

  body("gender")
    .optional()
    .isIn(["male", "female"])
    .withMessage('gender doit être "male" ou "female"'),

  body("username")
    .optional()
    .isString()
    .withMessage("username ne doit pas être vide")
    .bail()
    .notEmpty()
    .withMessage("username ne doit pas être vide")
    .bail()
    .isLength({ max: MAX_LENGTH })
    .withMessage(`username ne doit pas dépasser ${MAX_LENGTH} caractères`)
    .bail()
    .custom(async (value, { req }) => {
      if (!value) return true;
      const existingUsername = await User.findOne({ where: { username: value } });
      if (existingUsername && existingUsername.id !== Number(req.params.id)) {
        throw new Error("Ce username est déjà utilisé");
      }
      return true;
    }),

  body("first_name")
    .optional()
    .isString()
    .withMessage("first_name ne doit pas être vide")
    .bail()
    .notEmpty()
    .withMessage("first_name ne doit pas être vide")
    .bail()
    .isLength({ max: MAX_LENGTH })
    .withMessage(`first_name ne doit pas dépasser ${MAX_LENGTH} caractères`),

  body("last_name")
    .optional()
    .isString()
    .withMessage("last_name ne doit pas être vide")
    .bail()
    .notEmpty()
    .withMessage("last_name ne doit pas être vide")
    .bail()
    .isLength({ max: MAX_LENGTH })
    .withMessage(`last_name ne doit pas dépasser ${MAX_LENGTH} caractères`),

  body("age")
    .optional()
    .isISO8601()
    .withMessage("age doit être une date valide"),

  body("height")
    .optional({ nullable: true })
    .custom((value) => {
      if (typeof value === "undefined" || value === null) return true;
      const n = Number(value);
      if (!Number.isInteger(n) || n < 100 || n > 300) {
        throw new Error("height doit être un entier compris entre 100 et 300");
      }
      return true;
    }),

  body("email")
    .optional()
    .isString()
    .withMessage("email ne doit pas être vide")
    .bail()
    .notEmpty()
    .withMessage("email ne doit pas être vide")
    .bail()
    .isEmail()
    .withMessage("email doit avoir un format valide")
    .bail()
    .custom(async (value, { req }) => {
      if (!value) return true;
      const existingEmail = await User.findOne({ where: { email: value } });
      if (existingEmail && existingEmail.id !== Number(req.params.id)) {
        throw new Error("Cet email est déjà utilisé");
      }
      return true;
    }),

  body("password")
    .optional()
    .isString()
    .withMessage("password ne doit pas être vide")
    .bail()
    .notEmpty()
    .withMessage("password ne doit pas être vide")
    .bail()
    .isLength({ min: 8, max: MAX_PASSWORD_LENGTH })
    .withMessage(
      `password doit contenir entre 8 et ${MAX_PASSWORD_LENGTH} caractères`
    ),
];


