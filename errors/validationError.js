import CustomError from "./customError.js";

class ValidationError extends CustomError {
  constructor(message) {
    super(message, 400);
  }
}

export default ValidationError;
