import express from "express";
import userCtrlr from "../controllers/user.js";
import validatorLogin from "../middlewares/validate.js";
import validateRegisterReq from "../middlewares/validateRegisterReq.js"

const router = express.Router();

router.post("/user", validateRegisterReq, userCtrlr.register);
router.post( "/user/login", validatorLogin,userCtrlr.login);
export default router;
