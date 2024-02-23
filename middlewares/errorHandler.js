import mongoose from "mongoose";
import CustomError from "../errors/customError.js";

async function errorHandler(err, req, res, next) {
  // Handle Joi Schema Validation Error
  if (err.isJoi) {
    res.status(400).json(
      err.details.reduce((message, error) => {
        message[error.context.key] = error.message;
        return message;
      }, {}),
    );
    return;
  }

  // Handle Mongoose Validation Error
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.entries(err.errors);

    res.status(400).json(
      errors.reduce((message, [key, value]) => {
        message[key] = value.message;
        return message;
      }, {}),
    );
    return;
  }

  // Handle express.json() parsing Error
  if (err.type === "entity.parse.failed" && err instanceof SyntaxError) {
    res.status(400).json({
      message: err.message,
    });
    return;
  }

  // Handle Our custome error
  if (err instanceof CustomError) {
    res.status(err.status).json({ message: err.message });
    return;
  }

  // Handle Mongoose duplicate key error
  if (
    err.name === "MongoServerError" &&
    (err.code === 11000 || err.code === 11001)
  ) {
    res
      .status(400)
      .json({ message: `Duplication Error: ${err.keyValue.name}` });
    return;
  }

  console.log("UnHandled Error", err);
  res.status(500).json({ message: `Internal Server Error: ${err.message}` });
}

export default errorHandler;
