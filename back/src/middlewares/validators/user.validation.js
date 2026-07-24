import { body, validationResult } from "express-validator";
import db from "../../models/index.js";
import {
  GENDER_VALUES,
  EQUIPMENT_VALUES,
  FITNESS_LEVEL_VALUES,
  MIN_SESSIONS_PER_WEEK,
  MAX_SESSIONS_PER_WEEK,
} from "../../../../shared/constants.js";
import { sendError } from "../../utils/httpResponse.js";

const { User } = db;

const MAX_LENGTH = 150;
const MAX_PASSWORD_LENGTH = 300;

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(
      res,
      400,
      "Erreurs de validation",
      errors.array().map((err) => err.msg || err)
    );
  }
  next();
};

export const loginValidation = [
  body("email").isEmail().withMessage("Email invalide"),
  body("password").notEmpty().withMessage("Le mot de passe est obligatoire"),
];

export const registerValidation = [
  body("gender")
    .exists({ checkNull: true })
    .withMessage(`gender est obligatoire et doit être "${GENDER_VALUES.join('" ou "')}"`)
    .bail()
    .isIn(GENDER_VALUES)
    .withMessage(`gender est obligatoire et doit être "${GENDER_VALUES.join('" ou "')}"`),

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

  body("birthdate")
    .exists({ checkNull: true })
    .withMessage("birthdate est obligatoire")
    .bail()
    .isISO8601()
    .withMessage("birthdate doit être une date valide"),

  body("height")
    .exists({ checkNull: true })
    .withMessage("height est obligatoire")
    .bail()
    .isInt({ min: 100, max: 300 })
    .withMessage("height doit être un entier compris entre 100 et 300"),

  body("target_weight")
    .optional({ nullable: true })
    .isFloat({ min: 1, max: 500 })
    .withMessage("target_weight doit être un nombre compris entre 1 et 500"),

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

export const updateUserValidation = [
  body().custom((value) => {
    if (!value || typeof value !== "object") {
      throw new Error("Le corps de la requête doit être en JSON !");
    }

    const {
      gender,
      username,
      first_name,
      last_name,
      birthdate,
      height,
      target_weight,
      email,
      password,
    } = value;

    if (
      typeof gender === "undefined" &&
      typeof username === "undefined" &&
      typeof first_name === "undefined" &&
      typeof last_name === "undefined" &&
      typeof birthdate === "undefined" &&
      typeof height === "undefined" &&
      typeof target_weight === "undefined" &&
      typeof email === "undefined" &&
      typeof password === "undefined"
    ) {
      throw new Error("Au moins un champ doit être fourni pour une modification");
    }

    return true;
  }),

  body("gender")
    .optional()
    .isIn(GENDER_VALUES)
    .withMessage(`gender doit être "${GENDER_VALUES.join('" ou "')}"`),

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

  body("birthdate")
    .optional()
    .isISO8601()
    .withMessage("birthdate doit être une date valide"),

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

  body("target_weight")
    .optional({ nullable: true })
    .isFloat({ min: 1, max: 500 })
    .withMessage("target_weight doit être un nombre compris entre 1 et 500"),

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

export const createWeightValidation = [
  body("weight")
    .exists({ checkNull: true })
    .withMessage("weight est obligatoire")
    .bail()
    .isFloat({ min: 1, max: 500 })
    .withMessage("weight doit être un nombre compris entre 1 et 500"),
];

export const generateProgramValidation = [
  body("sessionsPerWeek")
    .exists({ checkNull: true })
    .withMessage("sessionsPerWeek est obligatoire")
    .bail()
    .isInt({ min: MIN_SESSIONS_PER_WEEK, max: MAX_SESSIONS_PER_WEEK })
    .withMessage(
      `sessionsPerWeek doit être un entier compris entre ${MIN_SESSIONS_PER_WEEK} et ${MAX_SESSIONS_PER_WEEK}`
    ),

  body("equipment")
    .exists({ checkNull: true })
    .withMessage(`equipment est obligatoire et doit être "${EQUIPMENT_VALUES.join('" ou "')}"`)
    .bail()
    .isIn(EQUIPMENT_VALUES)
    .withMessage(`equipment doit être "${EQUIPMENT_VALUES.join('" ou "')}"`),

  body("level")
    .exists({ checkNull: true })
    .withMessage(`level est obligatoire et doit être "${FITNESS_LEVEL_VALUES.join('" ou "')}"`)
    .bail()
    .isIn(FITNESS_LEVEL_VALUES)
    .withMessage(`level doit être "${FITNESS_LEVEL_VALUES.join('" ou "')}"`),
];
