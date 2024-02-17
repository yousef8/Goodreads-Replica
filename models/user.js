import mongoose from "mongoose";
import bcrypt from "bcrypt";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema(
  {
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
          `${props.value} must be only lower or upper case letters with no trailing/leading whitespaces`,
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
          `${props.value} must be only lower or upper case letters with no trailing/leading whitespaces`,
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator(v) {
          return /^[a-z0-9_-]{3,15}$/.test(v);
        },
        message: (props) =>
          `${props.value} invalid format, only lower letters, numbers, _, and - allowed, 3 to 15 character long `,
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator(v) {
          return /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(v);
        },
        message: (props) => `${props.value} invalid email format`,
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/.test(
            v,
          );
        },
        message: (props) =>
          `${props.value} invalid password, Minimum 8 characters, at least 1 upper case letter, 1 lower case letter, 1 number and 1 special character`,
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    read: {
      type: [mongoose.ObjectId],
      ref: "book",
    },
    currentlyReading: {
      type: [mongoose.ObjectId],
      ref: "book",
    },
    wantToRead: {
      type: [mongoose.ObjectId],
      ref: "book",
    },
  },
  {
    timestamps: true,

    toJSON: {
      transform: (doc, ret) => {
        const customRet = ret;
        // eslint-disable-next-line no-underscore-dangle
        delete customRet.__v;
        delete customRet.password;
        return customRet;
      },
    },
  },
);

userSchema.plugin(uniqueValidator);

userSchema.pre("save", async function preSaveHook() {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.verifyPassword = async function verifyPassword(password) {
  const valid = await bcrypt.compare(password.toString(), this.password);
  return valid;
};

const User = mongoose.model("user", userSchema);

export default User;
