/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import mongoose from "mongoose";
import { autoInc } from "auto-increment-group";
import Author from "./author.js";
import Category from "./category.js";

const bookSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      minLength: [2, "Name must be at least 2 characters long"],
      maxLength: [50, "Name cannot exceed 50 characters"],
    },
    imageUrl: {
      type: String,
      default: "default.jpg",
    },
    authorId: {
      type: String,
      validate: {
        validator: async function isAuthorExist(v) {
          const author = await Author.findOne({ id: v });
          return author;
        },
        message: (props) => `${props.value} not found!`,
      },
    },
    categoryId: {
      type: String,
      required: true,
      validate: {
        validator: async function ifCategoryExist(v) {
          const category = await Category.findOne({ id: v });
          return category;
        },
        message: (props) => `id ${props.value} not found!`,
      },
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    avgRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  {
    new: true,
    timeStamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

bookSchema.plugin(autoInc, {
  field: "id",
  digits: 1,
  startAt: 1,
  incrementBy: 1,
  unique: true,
});
const Book = mongoose.model("book", bookSchema);
export default Book;
