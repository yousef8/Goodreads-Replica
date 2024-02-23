import CustomError from "./customError.js";

class AuthroizationError extends CustomError {
  constructor(message) {
    super(`Not Authroized ${message ? `: ${message}` : ""}`, 403);
  }
}

export default AuthroizationError;
