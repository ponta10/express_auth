import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import memoRoutes from "./routes/memo";
import { verifyToken } from "./utils/verifyToken";

require("dotenv").config();

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/memo", verifyToken, memoRoutes);

mongoose
  .connect(process.env.DB_CONNECTION_STRING || "")
  .then(() =>
    app.listen(4000, () =>
      console.log(`Server running on http://localhost:4000`)
    )
  )
  .catch((err) => console.log(err));
