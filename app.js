import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";

const port = process.env.PORT || 5000;
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use("/images", express.static("images"));

app.use(routes);

app.use(errorHandler);

const LOCAL_DB = "mongodb://127.0.0.1:27017/GoodreadsApp";
mongoose.connect(process.env.DB_URL || LOCAL_DB).then(() => {
  app.listen(port, () => {
    console.log(`DB connected to ${process.env.DB_URL || LOCAL_DB}`);
    console.log(`Server is listening on port ${port}`);
  });
});
