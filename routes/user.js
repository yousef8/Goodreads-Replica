import express from "express";
import { register, login } from "../controllers/user.js";
import validatorLogin from "../middlewares/validate.js";

const router = express.Router();

router.post("/user", register);
router.post( "/user/login", validatorLogin, ( req, res ) => {
    const { username, password } = req.body;
    const user = login( username, password );
    if ( !user ) {
        return res.status( 400 ).json( {
            status: 'fail',
            message: 'wrong username or password, please try again',
    } )   
    }
    return res.status( 200 ).json( {
        message: 'success',
        data:user,
    })
} );
export default router;
