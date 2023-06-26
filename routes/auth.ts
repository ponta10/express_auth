import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User';

const router = express.Router();

// 新規ユーザー登録API
router.post('/register', async (req: Request, res: Response) => {
    // リクエストボディ取得
    const { username, password } = req.body;

    // usernameが一致するものを取得
    const userExists = await User.findOne({ username: username });
    // すでに存在していたらエラーを返す
    if (userExists) return res.status(400).json({ message: 'Username already exists' });

    // 条件を抜けたら新しいユーザーを作成
    const user = new User({ username, password });
    // 保存
    await user.save();

    res.status(200).json({ message: 'User registered successfully' });
});

// ログインAPI
router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username });
    if (!user) return res.status(400).json({ message: 'Invalid username' });

    // ユーザーが入力したパスワード（password）と、データベースに保存されているハッシュ化されたパスワード（user.password）を比較します
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

    // この関数の最初の引数はペイロードで、このJWTが保持する情報を示します。ここでは、ユーザーのID（_id）をペイロードとして設定しています
    // 二番目の引数は秘密鍵（JWT_SECRET）で、これによりトークンが正当なものであることを検証します
    // 三番目の引数はオプションで、ここではトークンの有効期限を1時間（'1h'）に設定しています
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });

    //　.json({ token })はレスポンスボディにトークンをJSON形式で含めます
    res.header('Authorization', 'Bearer ' + token).json({ token });
});

export default router;

