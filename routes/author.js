import { Router } from "express";
import authorCtrler from "../controllers/author.js";
import validateCreateAuthorReq from "../middlewares/validateCreateAuthorReq.js";
import authenticate from "../middlewares/authenticate.js";

const router = Router();

router.post("/authors", validateCreateAuthorReq, authorCtrler.create);

router.get("/authors", authenticate, authorCtrler.getAuthors);

router.get("/authors/:id", authenticate, authorCtrler.getAuthor);

export default router;
