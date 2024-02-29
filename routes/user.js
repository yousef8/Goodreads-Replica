import express from "express";
import userCtrlr from "../controllers/user.js";
import validatorLogin from "../middlewares/validateLogin.js";
import validateUserRegisterReq from "../middlewares/validateUserRegisterReq.js";
import authenticate from "../middlewares/authenticate.js";
import bookValidator from "../middlewares/bookValidator.js";
import validateRate from "../middlewares/validateRate.js";
import upload from "../middlewares/multerConfig.js";

const router = express.Router();

router.post(
  "/",
  validateUserRegisterReq,
  upload.single("image"),
  userCtrlr.register,
);
router.post("/login", validatorLogin, userCtrlr.login);
router.post("/library", authenticate, bookValidator, userCtrlr.addBookToUser);
router.get("/library", authenticate, userCtrlr.retrieveUserBooks);
router.patch("/library", authenticate, userCtrlr.updateUserBook);
router.delete("/library", authenticate, userCtrlr.removeUserBook);
router.patch("/", authenticate, validateRate, userCtrlr.rateBook);
export default router;
