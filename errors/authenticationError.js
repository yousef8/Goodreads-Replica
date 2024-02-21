import CustomError from "./customError.js";

class AuthenticationError extends CustomError {
  constructor(message) {
    super(`Unable to Authenticate ${message ? `: ${message}` : ""}`, 401);
  }
}

export default AuthenticationError;
