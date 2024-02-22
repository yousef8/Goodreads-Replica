import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import routes from "./routes/index.js";
import ValidationError from "./errors/validationError.js";
import CustomError from "./errors/customError.js";

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const imageMimeTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
  if (imageMimeTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }
  cb(new ValidationError("Unsupported image format"), false);
};

const app = express();
app.use(express.json());
app.use(multer({ storage: fileStorage, fileFilter }).single("image")); // single: for receiving 1 file, image: the name of the form field

const port = process.env.PORT || 5000;

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(routes);

app.use((err, req, res, next) => {
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
  if (err.name === "ValidationError") {
    const errors = Object.entries(err.errors);

    res.status(400).json(
      errors.reduce((message, [key, value]) => {
        message[key] = value.message;
        return message;
      }, {}),
    );
    return;
  }

  // Handle Our custome error
  if (err instanceof CustomError) {
    res.status(err.status).json({ message: err.message });
    return;
  }

  // Any Other UnHandled Error
  console.log("UnHandled Error", err);
  res.status(500).json({ message: `Internal Server Error: ${err.message}` });
});

mongoose.connect("mongodb://127.0.0.1:27017/GoodreadsApp").then(() => {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
});
