import { Router } from "express";
import category from "../controllers/category.js";
import authenticate from "../middlewares/authenticate.js";
import authorizeAdmin from "../middlewares/authorizeAdmin.js";
import validateCategoryReq from "../middlewares/validateCategory.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizeAdmin,
  validateCategoryReq,
  category.create,
);

router.patch(
  "/:id",
  authenticate,
  authorizeAdmin,
  validateCategoryReq,
  category.update,
);

router.get("/", category.getAll);
router.get("/:id", category.getOne);

router.delete("/:id", authenticate, authorizeAdmin, category.remove);

export default router;
