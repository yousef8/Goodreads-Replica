import express from "express";
import userCtrlr from "../controllers/user.js";
import validatorLogin from "../middlewares/validate.js";
import validateRegisterReq from "../middlewares/validateRegisterReq.js"

const router = express.Router();

router.post("/user", validateRegisterReq, userCtrlr.register);
router.post( "/user/login", validatorLogin, ( req, res ) => {
    const { username, password } = req.body;
    const user = userCtrlr.login(username, password);
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
