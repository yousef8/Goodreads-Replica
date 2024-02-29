import express from "express";
import userCtrlr from "../controllers/user.js";
import validatorLogin from "../middlewares/validateLogin.js";
import validateRegisterReq from "../middlewares/validateRegisterReq.js";
import authenticate from "../middlewares/authenticate.js";
import bookValidator from "../middlewares/bookValidator.js";

const router = express.Router();

router.post("/", validateRegisterReq, userCtrlr.register);
router.post("/login", validatorLogin, userCtrlr.login);
router.post("/library", authenticate, bookValidator, userCtrlr.addBookToUser);
router.get("/library", authenticate, userCtrlr.retrieveUserBooks);
router.patch("/library", authenticate, userCtrlr.updateUserBook);
router.delete("/library", authenticate, userCtrlr.removeUserBook);

export default router;
