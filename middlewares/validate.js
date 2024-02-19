/* eslint-disable import/no-extraneous-dependencies */
import Joi from "joi";

const validatorLogin = (req, res, next) => {
  const loginSchema = Joi.object({
    username: Joi.string()
      .required(),
    password: Joi.string()
      .required(),
  });
  const validationResult = loginSchema.validate(req.body);
  if (!validationResult.error) {
    return next();
  }
  return next( validationResult.error );
};

export default validatorLogin;
