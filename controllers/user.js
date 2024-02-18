import User from "../models/user.js";
import asyncWrapper from "../utils/asyncWrapper.js";

async function register(req, res, next) {
  const [mongooseError, user] = await asyncWrapper(
    new User(req.validReq).save(),
  );

  if (mongooseError) {
    console.log(mongooseError);
    next(mongooseError);
    return;
  }

  res.status(201).json(user);
}

export default { register };
