import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// userSchema.pre('save'というのは、データが保存される前に実行する処理を定義しています。
// この場合、それはユーザーのパスワードをハッシュ化する機能を持っています。
// もしユーザーがパスワードを変更（または新しく設定）しているなら、それはまず新しいソルトを生成し、次にそのソルトを使ってパスワードをハッシュ化します。
userSchema.pre('save', async function(next: (error?: any) => void) {
    const user = this as any;
    if (!user.isModified('password')) return next();
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
});  

// 与えられたパスワードがデータベースに保存されたハッシュ化されたパスワードと一致するかどうかを確認するメソッドを定義しています。
userSchema.methods.comparePassword = function(password: string) {
  const user = this as any;
  return bcrypt.compare(password, user.password);
};

const User = mongoose.model('User', userSchema);
export default User;
