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

async function login ( req, res ) {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "wrong username or password, please try again",
    });
  }

  const validPassword = await user.verifyPassword( req.body.password );
  if (!validPassword) {
    return res.status(400).json({
      status: "fail",
      message: "wrong username or password, please try again",
    });
  };

  const token = jwt.sign(
    { userId: user._id }, "L#z&7B7Jq*$qC3%N64s@J4pP3r^gZ!mT",
    {
      expiresIn: "1d",
    },
  );
  return res.status(200).json({
    message: "success",
    data: {token, user},
  });

}

export default { register, login}
