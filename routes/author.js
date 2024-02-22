import { Router } from "express";
import authorCtrler from "../controllers/author.js";
import authenticate from "../middlewares/authenticate.js";
import authorizeAdmin from "../middlewares/authorizeAdmin.js";
import authorValidation from "../middlewares/authorSchemaValidation.js";
import upload from "../middlewares/multerConfig.js";

const router = Router();

router.post(
  "/authors",
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  authorValidation.validateCreate,
  authorCtrler.create,
);

router.get("/authors", authorCtrler.getAuthors);

router.get("/authors/:id", authorCtrler.getAuthor);

router.patch(
  "/authors/:id",
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  authorValidation.validateUpdate,
  authorCtrler.updateAuthor,
);

router.delete(
  "/authors/:id",
  authenticate,
  authorizeAdmin,
  authorCtrler.deleteAuthor,
);

export default router;
