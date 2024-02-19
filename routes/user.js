import express from "express";
// import userCtrler from "../controllers/user.js";
import { register, login } from '../controllers/user.js'
import validateRegisterReq from "../middlewares/validateRegisterReq.js";
import asyncWrapper from "../utils/asyncWrapper.js";

const router = express.Router();

router.post("/user", validateRegisterReq, register);
router.post('/login', async (req, res, next) =>{
  console.log('Request Body:', req.body);
  const { username, password } = req.body;
  console.log(username, password);
  const [err, token] = await asyncWrapper(login(req));
  if(!token) {
    return next(err)
  }
  return res.json(token);
})
export default router;
