import mongoose from "mongoose";
import { autoInc } from "auto-increment-group";

const authorSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 15,
      validate: {
        validator(v) {
          return /^[a-zA-Z]+$/.test(v);
        },
        message: (props) =>
          `${props.value} must be lower or upper case letters with no trailing/leading whitespaces`,
      },
    },
    lastName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 15,
      validate: {
        validator(v) {
          return /^[a-zA-Z]+$/.test(v);
        },
        message: (props) =>
          `${props.value} must be lower or upper case letters with no trailing/leading whitespaces`,
      },
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        const customRet = ret;
        // eslint-disable-next-line no-underscore-dangle
        delete customRet.__v;
        return customRet;
      },
    },
  },
);

authorSchema.plugin(autoInc, { startAt: 1 });

const Author = mongoose.model("author", authorSchema);

export default Author;
