import express from "express";
import userRouter from "./user.js";
import authorRouter from "./author.js";

const router = express.Router();

router.use(userRouter);
router.use(authorRouter);

export default router;
