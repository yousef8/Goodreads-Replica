import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

const app = express();

const port = process.env.PORT || 5000;

mongoose.connect("mongodb://127.0.0.1:27017/GoodreadsApp").then(() => {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
});
