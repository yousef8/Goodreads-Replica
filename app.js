import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes/index.js";

const app = express();
app.use(express.json());
app.use(bodyParser.json());

const corsOptions ={
  origin:'*', 
  credentials:true,
  optionSuccessStatus:200,
}
app.use(cors(corsOptions))

const port = process.env.PORT || 5000;

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

  // Any Other UnHandled Error
  console.log("UnHandled Error", err);
  res.status(500).json({ msg: "Internal Server Error" });
});

mongoose.connect("mongodb://127.0.0.1:27017/GoodreadsApp").then(() => {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
});
