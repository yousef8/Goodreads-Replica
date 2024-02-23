/* eslint-disable no-unused-vars */
import jwt from "jsonwebtoken"
import util from "util";
import User from "../models/user.js";
import asyncWrapper from "../utils/asyncWrapper.js";


const verifyAsync = util.promisify(jwt.verify);
async function authAdmin ( req, res, next ) {
        if ( !req.cookies.token )
            return res.sendStatus( 401 );
        const  {token} = req.cookies;
    const [ jwtErr, isAuth ] = await asyncWrapper(
        verifyAsync( token, process.env.SECRET ),
        );
        if ( jwtErr )
            return next( jwtErr );
    const admin = await User.findById( isAuth.userId ).exec();
    if (!admin) return res.sendStatus(401);
        if (admin.isAdmin) return next();
        return res.sendStatus( 401 );
}

async function authUser ( req, res, next ) {
    if (!req.cookies.token) return res.sendStatus(401);
    const { token } = req.cookies;
    const [jwtErr, isAuth] = await asyncWrapper(
    verifyAsync(token, process.env.SECRET),
    );
    if (jwtErr) return next(jwtErr);
    const user = await User.findById(isAuth.id).exec();
    if (!user) return res.sendStatus(401);
    return next();
}
export default { authAdmin, authUser } 
