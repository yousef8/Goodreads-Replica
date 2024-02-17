/* eslint-disable import/no-extraneous-dependencies */
import Joi from "joi";

const validatorLogin = (req, res, next) => {
  const loginSchema = Joi.object({
    username: Joi.string().pattern("/^[a-z0-9_-]{3,15}$/.test(v)").required(),
    password: Joi.string().pattern(
      "/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/",
    ).required(),
  });
  const validationResult = Joi.validate(req.body, loginSchema);
    if ( !validationResult.error ) { return next(); }

  return res.status(401).json({
    message: "fail",
    data: validationResult.error,
  });
};
export default validatorLogin;
