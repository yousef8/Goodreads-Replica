import Joi from "joi";
import asyncWrapper from "../utils/asyncWrapper.js";

async function validateRegisterReq(req, res, next) {
  const schema = Joi.object({
    firstName: Joi.string()
      .trim()
      .pattern(/^[a-zA-Z]+$/)
      .min(3)
      .max(15)
      .required(),
    lastName: Joi.string()
      .trim()
      .pattern(/^[a-zA-Z]+$/)
      .min(3)
      .max(15)
      .required(),
    username: Joi.string()
      .trim()
      .pattern(/^[a-z0-9_-]+$/, "username")
      .min(3)
      .max(15)
      .required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string()
      .trim()
      .pattern(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
        "password",
      )
      .required(),
    isAdmin: Joi.boolean(),
  });

  const [joiError, validReq] = await asyncWrapper(
    schema.validateAsync(req.body),
  );

  if (joiError) {
    next(joiError);
  }

  req.validReq = validReq;
  next();
}

export default validateRegisterReq;
