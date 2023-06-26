import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ message: 'Access Denied' });

    const parts = authHeader.split(' ');
    if (parts.length !== 2) return res.status(401).json({ message: 'Token error: Token must be Bearer token' });
    const [ scheme, token ] = parts;
    if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ message: 'Token error: Token format must be Bearer token' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || '');
        (req as any).user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
}

