/* eslint-disable import/extensions */
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import User from "../models/user.js";
import asyncWrapper from "../utils/asyncWrapper.js";
// import CustomError from "../utils/CustomError";

dotenv.config();


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

const login = async (req, res) => {
  console.log('Request Body in the login:', req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(401).json({ error: 'Unauthorized User' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized User' });
    }

    const valid = await user.verifyPassword(password);

    if (!valid) {
      return res.status(401).json({ error: 'Unauthorized User' });
    }

    const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1d',
    });

    console.log('User logged in:', username);
    return res.json({ token });
  } catch (error) {
    console.error('Error in login:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


export { register, login };
