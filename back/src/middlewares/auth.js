//outils pour décoder et vérifier les tokens JWT
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false,
            message: 'Token non trouvé',
            data: null
        });
    }    
    const token = header.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        return next();
    } catch (error) {
        return res.status(401).json({ 
            success: false,
            message: 'Token invalide',
            data: null
        });
    }
};