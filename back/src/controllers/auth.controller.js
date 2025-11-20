import { register, validateCredentials, generateToken } from '../services/auth.service.js';
import { validationResult } from 'express-validator';

export const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            message: 'Erreurs de validation',
            errors: errors.array() 
        });
    }
    try {
        const { name, email, password} = req.body;
        const user = await register(name,email, password);
        res.status(201).json({ 
            success: true,
            message: 'Utilisateur créé avec succès',
            data: user
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

export const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            message: 'Erreurs de validation',
            errors: errors.array() 
        });
    }

    const { email, password } = req.body;

    try {
        const user = await validateCredentials(email, password);
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }
        res.status(200).json({ 
            success: true,
            message: 'Connexion réussie',
            data: user,
            token: await generateToken(user)
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};