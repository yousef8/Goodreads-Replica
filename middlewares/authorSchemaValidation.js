import Joi from "joi";
import asyncWrapper from "../utils/asyncWrapper.js";

async function validateCreate(req, res, next) {
  const schema = Joi.object({
    firstName: Joi.string()
      .trim()
      .min(3)
      .max(15)
      .pattern(/^[a-zA-Z]+$/)
      .required(),
    lastName: Joi.string()
      .trim()
      .min(3)
      .max(15)
      .pattern(/^[a-zA-Z]+$/)
      .required(),
    dateOfBirth: Joi.date().iso().less("now").required(),
    image: Joi.binary(),
  });

  const [joiError, validReq] = await asyncWrapper(
    schema.validateAsync(req.body),
  );

  if (joiError) {
    next(joiError);
    return;
  }

  req.validReq = validReq;
  next();
}

async function validateUpdate(req, res, next) {
  const schema = Joi.object({
    firstName: Joi.string()
      .trim()
      .min(3)
      .max(15)
      .pattern(/^[a-zA-Z]+$/),
    lastName: Joi.string()
      .trim()
      .min(3)
      .max(15)
      .pattern(/^[a-zA-Z]+$/),
    dateOfBirth: Joi.date().iso().less("now"),
    image: Joi.binary(),
  });

  const [joiError, validReq] = await asyncWrapper(
    schema.validateAsync(req.body),
  );

  if (joiError) {
    next(joiError);
    return;
  }

  req.validReq = validReq;
  next();
}

export default { validateCreate, validateUpdate };
