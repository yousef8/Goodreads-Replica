import joi from "joi";
import asyncWrapper from "../utils/asyncWrapper.js";

const validateCreate = async (req, res, next) => {
  const bookSchema = joi.object({
    name: joi.string().trim().required(),
    image: joi.binary(),
    authorId: joi.string().required(),
    categoryId: joi.string().required(),
  });
  const [err, validResult] = await asyncWrapper(
    bookSchema.validateAsync(req.body),
  );

  if (!err) {
    req.book = validResult;
    return next();
  }
  return next(err);
};

const validateUpdate = async (req, res, next) => {
  const shcema = joi.object({
    name: joi.string().trim(),
    image: joi.binary(),
    authorId: joi.string(),
    categoryId: joi.string(),
    rating: joi.number(),
    avgRating: joi.number(),
  });
  const [validationErr, validRes] = await asyncWrapper(
    shcema.validateAsync(req.body),
  );
  if (validationErr) return next(validationErr);
  req.book = validRes;
  return next();
};

export default { validateCreate, validateUpdate };
