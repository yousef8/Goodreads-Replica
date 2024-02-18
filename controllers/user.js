import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
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

async function login(userName, password) {
  const user = await User.findOne({ username: userName });
  if (!user) return false;

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return false;

  const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
    expiresIn: "1d",
  });
  const loginUser = {
    tokens: token,
    User: user,
  };
  return loginUser;
}

export default { register, login}
