import express from "express";
import userCtrlr from "../controllers/user.js";
import validatorLogin from "../middlewares/validateLogin.js";
import validateRegisterReq from "../middlewares/validateRegisterReq.js"
import authenticate from "../middlewares/authenticate.js";
import validateRate from "../middlewares/validateRate.js";
const router = express.Router();

router.post("/",validateRegisterReq, userCtrlr.register);
router.post( "/login", validatorLogin, userCtrlr.login );
router.patch("/", authenticate ,validateRate, userCtrlr.rateBook);
export default router;
