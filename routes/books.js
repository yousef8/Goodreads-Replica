import { Router } from "express";
import upload from "../middlewares/multerConfig.js";
import booksCtrler from "../controllers/books.js";
import validation from "../middlewares/validateBooks.js";
import authenticate from "../middlewares/authenticate.js";
import authorizeAdmin from "../middlewares/authorizeAdmin.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  validation.validateCreateBookReq,
  booksCtrler.create,
);
router.patch(
  "/:id",
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  validation.validateUpdateBookReq,
  booksCtrler.update,
);

router.get("/", booksCtrler.getAll);

router.get("/:id", booksCtrler.getBook);

router.delete("/:id", authenticate, authorizeAdmin, booksCtrler.remove);

export default router;
