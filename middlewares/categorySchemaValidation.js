import joi from "joi";
import asyncWrapper from "../utils/asyncWrapper.js";

const validateCreate = async (req, res, next) => {
  const schema = joi.object({
    name: joi.string().trim().required(),
  });
  const [validationErr, validRes] = await asyncWrapper(
    schema.validateAsync(req.body),
  );
  if (validationErr) return next(validationErr);
  req.category = validRes;
  return next();
};

const validateUpdate = async (req, res, next) => {
  const schema = joi.object({
    name: joi.string().trim(),
  });
  const [validationErr, validRes] = await asyncWrapper(
    schema.validateAsync(req.body),
  );
  if (validationErr) return next(validationErr);
  req.category = validRes;
  return next();
};
export default { validateCreate, validateUpdate };
