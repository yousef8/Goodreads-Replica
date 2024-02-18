/* eslint-disable no-underscore-dangle */
import  bcrypt  from "bcrypt";
import  jwt  from "jsonwebtoken";
import User from "../models/user.js";

export async function register(req, res) {
  res.status(501).json({ message: "To-Do" });
}

export async function login(userName, password) {
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
