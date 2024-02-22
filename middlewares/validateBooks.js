import joi from "joi"
import asyncWrapper from "../utils/asyncWrapper.js";

const validateBook = async ( req, res, next ) => {
  console.log( req.body );
    const bookSchema = joi.object({
      name: joi.string().trim().required(),
      photo: joi.string().trim().required(),
      authorId: joi.number().required(),
      categoryId: joi.number().required(),
    });
        const [err, validResult] = await asyncWrapper(
          bookSchema.validateAsync(req.body),
        );
        if ( !err ) {
            req.book = validResult;
            return next();
        }
        return next(err);
}

const validateUpdate = async( req, res, next )=>{
  const shcema = joi.object({
    name: joi.string().trim(),
    photo: joi.string().trim(),
    authorId: joi.number(),
    categoryId: joi.number(),
    rating: joi.number(),
    avgRating: joi.number()
  });
  const [ validationErr, validRes ] = await asyncWrapper(shcema.validateAsync( req.body ));
  if ( validationErr )
    return next( validationErr )
  req.book = validRes;
  return next();
}
export default { validateBook, validateUpdate }
