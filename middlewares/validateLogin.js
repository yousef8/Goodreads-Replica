/* eslint-disable import/no-extraneous-dependencies */
import Joi from "joi";
import asyncWrapper from "../utils/asyncWrapper.js";

const validatorLogin = async (req, res, next) => {
  const loginSchema = Joi.object({
    username: Joi.string()
      .required(),
    password: Joi.string()
      .required(),
  });
  const [err, validResult] = await asyncWrapper(loginSchema.validateAsync(req.body));
  if ( !err ) {
    req.user = validResult;
    return next();
  }
  return next( err );
};

export default validatorLogin;
