import mongoose from 'mongoose';

const memoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Memo = mongoose.model('Memo', memoSchema);
export default Memo;
