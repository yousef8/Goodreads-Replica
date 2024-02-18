import express from "express";
import userCtrler from "../controllers/user.js";
import validateRegisterReq from "../middlewares/validateRegisterReq.js";

const router = express.Router();

router.post("/user", validateRegisterReq, userCtrler.register);

export default router;
