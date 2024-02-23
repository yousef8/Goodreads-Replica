import AuthroizationError from "../errors/authorizationError.js";

async function authorizeAdmin(req, res, next) {
  if (req.user.isAdmin) {
    next();
    return;
  }

  next(new AuthroizationError("Only Admins Allowed"));
}

export default authorizeAdmin;
