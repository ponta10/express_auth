import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    // リクエストのヘッダーからAuthorizationを取得します。
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ message: 'Access Denied' });

    const parts = authHeader.split(' ');

    // AuthorizationヘッダーからBearerとトークン部分を分割して取得します
    if (parts.length !== 2) return res.status(401).json({ message: 'Token error: Token must be Bearer token' });
    const [ scheme, token ] = parts;

    // Bearer"スキームが正しく設定されているかどうかを確認します
    if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ message: 'Token error: Token format must be Bearer token' });

    try {
        // ここでjsonwebtokenのverifyメソッドを使用してJWTトークンを検証します。
        // トークンが有効であれば、リクエストオブジェクトにユーザー情報を設定します。これにより、後続の処理でユーザー情報を参照できるようになります。
        // このメソッドはトークンが有効であればデコードされたペイロード（この場合ユーザー情報）を、無効であればエラーを投げます
        const verified = jwt.verify(token, process.env.JWT_SECRET || '');

        // 検証が成功した場合、リクエストオブジェクトにデコードされたJWTペイロード（ユーザー情報）を追加します。
        // これにより、このミドルウェアの後に呼ばれるルートハンドラーでは、リクエストオブジェクトからユーザー情報を取得することができます。
        (req as any).user = verified;
        
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
}

