import express from "express"
import category from "../controllers/category.js"; 
import auth from "../controllers/auth.js"
import validation from "../middlewares/validateCategory.js"

const router = express.Router();
router.use( auth.authAdmin );
router.post( '/', validation, category.create );
router.patch( '/:id',validation,category.update );
router.get( '/', category.getAll );
router.get( '/:id', category.getOne );
router.delete( '/:id', category.remove );

export default router
