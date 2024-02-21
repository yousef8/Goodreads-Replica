import { Router } from "express";
import authorCtrler from "../controllers/author.js";
import validateCreateAuthorReq from "../middlewares/validateCreateAuthorReq.js";

const router = Router();

router.post("/authors", validateCreateAuthorReq, authorCtrler.create);

export default router;
