import Joi from "joi";
import User from "../models/user.js";
import asyncWrapper from "../utils/asyncWrapper.js";

async function register(req, res, next) {
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

  const [joiError, validRequest] = await asyncWrapper(
    schema.validateAsync(req.body),
  );

  if (joiError) {
    next(joiError);
    return;
  }

  const [mongooseError, user] = await asyncWrapper(
    new User(validRequest).save(),
  );

  if (mongooseError) {
    console.log(mongooseError);
    next(mongooseError);
    return;
  }

  res.status(201).json(user);
}

export default { register };
