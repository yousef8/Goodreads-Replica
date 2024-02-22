import express from "express";
import userRouter from "./user.js";
import authorRouter from "./author.js";
import adminRouter from "./admin.js"
import booksRouter from "./books.js"
import categoryRouter from "./category.js";
const router = express.Router();

router.use('/user',userRouter );
router.use( '/books', booksRouter );
router.use( '/categories', categoryRouter );
router.use(authorRouter);
router.use( '/admin', adminRouter );
export default router;
