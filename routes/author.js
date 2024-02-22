import { Router } from "express";
import authorCtrler from "../controllers/author.js";
import validateCreateAuthorReq from "../middlewares/validateCreateAuthorReq.js";
import authenticate from "../middlewares/authenticate.js";
import authorizeAdmin from "../middlewares/authorizeAdmin.js";
import validateUpdateAuthorReq from "../middlewares/validateUpdateAuthorReq.js";

const router = Router();

router.post(
  "/authors",
  authenticate,
  authorizeAdmin,
  validateCreateAuthorReq,
  authorCtrler.create,
);

router.get("/authors", authenticate, authorCtrler.getAuthors);

router.get("/authors/:id", authenticate, authorCtrler.getAuthor);

router.patch(
  "/authors/:id",
  authenticate,
  authorizeAdmin,
  validateUpdateAuthorReq,
  authorCtrler.updateAuthor,
);

router.delete(
  "/authors/:id",
  authenticate,
  authorizeAdmin,
  authorCtrler.deleteAuthor,
);

export default router;
