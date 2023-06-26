import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.pre('save', async function(next: (error?: any) => void) {
    const user = this as any;
    if (!user.isModified('password')) return next();
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
});  

userSchema.methods.comparePassword = function(password: string) {
  const user = this as any;
  return bcrypt.compare(password, user.password);
};

const User = mongoose.model('User', userSchema);
export default User;
