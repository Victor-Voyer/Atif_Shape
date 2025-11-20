import { body } from 'express-validator';

//validation d'enregistrement
export const registerValidation = [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères'),
];

//validation de connexion
export const loginValidation = [
    body('email').isEmail(),
    body('password').notEmpty(),
];