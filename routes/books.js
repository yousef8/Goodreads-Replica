import express from "express"
import booksCtrlr from "../controllers/books.js"
import validation from "../middlewares/validateBooks.js"
import auth from "../controllers/auth.js";

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.use( auth.authAdmin );
router.post(
  "/",
  booksCtrlr.upload.single( "photo" ),
  ( req, res, next ) => {
    req.body.photo = req.file.path;
    next();
  },
  validation.validateBook,
  booksCtrlr.create,
);
router.patch(
  "/:id",
  booksCtrlr.upload.single("photo"),
  (req, res, next) => {
    req.body.photo = req.file.path;
    next();
  },
  validation.validateUpdate,
  booksCtrlr.update,
);
router.get( '/:id', booksCtrlr.getBook ) 
router.delete("/:id", booksCtrlr.remove);

export default router
