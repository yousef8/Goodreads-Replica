import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
const port = process.env.PORT || 5000;
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
const app = express();

app.use(express.json());
app.use("/images", express.static("images"));
app.use(cors(corsOptions));
app.use( cookieParser() );
app.use(routes);

app.use(errorHandler);

mongoose.connect("mongodb://127.0.0.1:27017/GoodreadsApp").then(() => {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
});
