import { Router } from "express";
import upload from "../middlewares/multerConfig.js";
import booksCtrler from "../controllers/books.js";
import bookValidation from "../middlewares/bookSchemaValidation.js";
import authenticate from "../middlewares/authenticate.js";
import authorizeAdmin from "../middlewares/authorizeAdmin.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizeAdmin,
  upload.single("imageUrl"),
  bookValidation.validateCreate,
  booksCtrler.create,
);
router.patch(
  "/:id",
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  bookValidation.validateUpdate,
  booksCtrler.update,
);

router.get("/", booksCtrler.getAll);

router.get("/:id", booksCtrler.getBook);

router.delete("/:id", authenticate, authorizeAdmin, booksCtrler.remove);

export default router;
