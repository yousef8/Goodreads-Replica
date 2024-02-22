import express from "express";
import userCtrlr from "../controllers/user.js";
import validatorLogin from "../middlewares/validateLogin.js";
import validateRegisterReq from "../middlewares/validateRegisterReq.js";

const router = express.Router();

router.post("/", validateRegisterReq, userCtrlr.register);
router.post("/login", validatorLogin, userCtrlr.login);
export default router;
