import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const userExists = await User.findOne({ username: username });
    if (userExists) return res.status(400).json({ message: 'Username already exists' });

    const user = new User({ username, password });
    await user.save();

    res.status(200).json({ message: 'User registered successfully' });
});

router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username });
    if (!user) return res.status(400).json({ message: 'Invalid username' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });

    res.header('auth-token', token).json({ token });
});

export default router;

