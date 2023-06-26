import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import memoRoutes from './routes/memo';

const app = express();
app.use(express.json());

mongoose.connect(process.env.DB_CONNECTION_STRING || '')
  .then(() => console.log('Database connected'))
  .catch(err => console.log(err));

app.use('/auth', authRoutes);
app.use('/memo', memoRoutes);

app.listen(3000, () => console.log('Server started'));
