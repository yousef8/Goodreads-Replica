import express from "express";
import userCtrler from "../controllers/user.js";

const router = express.Router();

router.post("/user", userCtrler.register);

export default router;
