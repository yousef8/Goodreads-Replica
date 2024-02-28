import express from "express";
import userCtrlr from "../controllers/user.js";
import validatorLogin from "../middlewares/validateLogin.js";
import validateRegisterReq from "../middlewares/validateRegisterReq.js"
import upload from "../middlewares/multerConfig.js";
const router = express.Router();
router.post(
    "/",  
upload.single("image"),
validateRegisterReq, 
userCtrlr.register);
router.post( "/login", validatorLogin,userCtrlr.login);
export default router;
