import express from "express";
import userCtrlr from "../controllers/user.js";
import validatorLogin from "../middlewares/validateLogin.js";
import validateAdminRegisterReq from "../middlewares/validateAdminRegisterReq.js";
import authenticate from "../middlewares/authenticate.js";
import authorizeAdmin from "../middlewares/authorizeAdmin.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorizeAdmin,
  validateAdminRegisterReq,
  userCtrlr.register,
);
router.post("/login", validatorLogin, userCtrlr.login);

export default router;
