import jwt from 'jsonwebtoken';
import statusCode from 'http-status-codes';

export const authMiddleWare = (req,res,next) =>{
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const jwt_secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, jwt_secret);
        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (error) {
        console.error('Error in authMiddleware:', error);
        return res.status(statusCode.UNAUTHORIZED).json({ message: 'Invalid or expired token' });
    }


}