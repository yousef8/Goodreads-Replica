/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import mongoose from "mongoose";
import { autoInc } from "auto-increment-group";

const categorySchema = mongoose
  .Schema(
    {
      id: {
        type: String,
      },
      name: {
        type: String,
        unique: true,
        required: true,
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
  )

  categorySchema.plugin(autoInc, {
    field: "id",
    digits: 1,
    startAt: 1,
    incrementBy: 1,
    unique: true,
  });

const category = mongoose.model( "Category", categorySchema );
export default category
