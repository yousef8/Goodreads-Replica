import CustomError from "./customError.js";

class InternalError extends CustomError {
  constructor(message) {
    super(`Server Internal Error ${message ? `: ${message}` : ""}`, 500);
  }
}

export default InternalError;
