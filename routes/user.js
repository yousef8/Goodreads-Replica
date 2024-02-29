import express from "express";
import userCtrlr from "../controllers/user.js";
import validatorLogin from "../middlewares/validateLogin.js";
import validateRegisterReq from "../middlewares/validateRegisterReq.js";
import authenticate from "../middlewares/authenticate.js";
import {
  bookValidator,
  ratingValidator,
} from "../middlewares/bookValidator.js";

const router = express.Router();

router.post("/", validateRegisterReq, userCtrlr.register);
router.post("/login", validatorLogin, userCtrlr.login);
router.post("/:userId", authenticate, bookValidator, userCtrlr.addBookToUser);
router.get("/userId", authenticate, userCtrlr.retrieveUserBooks);
router.patch(
  "/userId",
  authenticate,
  ratingValidator,
  userCtrlr.updateUserBook,
);
router.delete("/userId", authenticate, userCtrlr.removeUserBook);

export default router;
