import express, { Request, Response } from 'express';
import Memo from '../models/Memo';
import { verifyToken } from '../utils/verifyToken';

const router = express.Router();

router.post('/', verifyToken, async (req: Request, res: Response) => {
    const { title, content } = req.body;
    const userId = (req as any).user._id;

    const memo = new Memo({ title, content, userId });
    await memo.save();

    res.status(200).json({ message: 'Memo created successfully' });
});

router.get('/', verifyToken, async (req: Request, res: Response) => {
    const userId = (req as any).user._id;

    const memos = await Memo.find({ userId: userId });

    res.status(200).json({ memos });
});

export default router;
