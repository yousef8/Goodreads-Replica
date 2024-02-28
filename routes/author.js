import { Router } from "express";
import authorCtrler from "../controllers/author.js";
import authenticate from "../middlewares/authenticate.js";
import authorizeAdmin from "../middlewares/authorizeAdmin.js";
import authorValidation from "../middlewares/authorSchemaValidation.js";
import upload from "../middlewares/multerConfig.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  authorValidation.validateCreate,
  authorCtrler.create,
);

router.get("/", authorCtrler.getAuthors);

router.get("/:id", authorCtrler.getAuthor);

router.patch(
  "/:id",
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  authorValidation.validateUpdate,
  authorCtrler.updateAuthor,
);

router.delete("/:id", authenticate, authorizeAdmin, authorCtrler.deleteAuthor);

export default router;
