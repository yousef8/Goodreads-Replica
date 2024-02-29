import Joi from "joi";
import asyncWrapper from "../utils/asyncWrapper.js";

const bookValidator = async (req, res, next) => {
  const bookIdSchema = Joi.string().trim().pattern(/^\d+$/).required();
  const [err, ValidateResult] = await asyncWrapper(
    bookIdSchema.validateAsync(req.body.bookId),
  );
  if (!err) {
    req.bookId = ValidateResult;
    return next();
  }
  return next(err);
};

export default bookValidator;
