import Joi from "joi";
import asyncWrapper from "../utils/asyncWrapper.js";

const bookValidator = async (req, res, next) => {
  const bookIdSchema = Joi.string().trim().pattern(/^\d+$/).required();
  const [err, ValidateResult] = await asyncWrapper(
    bookIdSchema.validateAsync(req.body),
  );
  if (!err) {
    req.bookId = ValidateResult;
    return next();
  }
  return next(err);
};

const ratingValidator = async (req, res, next) => {
  const ratingSchema = Joi.number().min(0).max(5).required();
  const [err, validationResult] = await asyncWrapper(
    ratingSchema.validateAsync(req.body.rating),
  );

  if (!err) {
    req.rating = validationResult;
    return next();
  }

  return next(err);
};

export { bookValidator, ratingValidator };
