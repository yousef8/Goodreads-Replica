/* eslint-disable import/no-extraneous-dependencies */
import Joi from "joi";

const validatorLogin = (req, res, next) => {
  const loginSchema = Joi.object({
    username: Joi.string()
      .pattern(/^[a-z0-9_-]+$/)
      .required(),
    password: Joi.string()
      .pattern(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
      )
      .required(),
  });
  const validationResult = loginSchema.validate(req.body);
  if (!validationResult.error) {
    return next();
  }

  return res.status(401).json({
    message: "fail",
    data: validationResult.error.message,
  });
};
export default validatorLogin;
