import jwt from "jsonwebtoken";
import User from "../models/user.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import ValidationError from "../errors/validationError.js";
import Book from "../models/books.js";

async function register(req, res, next) {
  const [mongooseError, user] = await asyncWrapper(
    new User(req.validReq).save(),
  );

  if (mongooseError) {
    next(mongooseError);
    return;
  }

  res.status(201).json(user);
}

async function login(req, res) {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res
      .status(400)
      .json(
        new ValidationError("wrong username or password, please try again"),
      );
  }

  const validPassword = await user.verifyPassword(req.body.password);
  if (!validPassword) {
    return res
      .status(400)
      .json(
        new ValidationError("wrong username or password, please try again"),
      );
  }

  const token = jwt.sign({ userId: user._id , isAdmin:user.isAdmin}, process.env.SECRET, {
    expiresIn: "1d",
  });
  return res.status(200).json({ token });
}


async function rateBook ( req, res, next ) {
  let [ mongooseError, bookInUser ] = await asyncWrapper( User.findOneAndUpdate(
    { _id: req.user._id, "books.book": req.body.bookId },
    {
      $set: {
        "books.$.rating": req.body.rating,
      },
    },
    { new: true }
  ), );
  if (!bookInUser) {
    [mongooseError, bookInUser] = await asyncWrapper( User.findByIdAndUpdate(
      { _id: req.body.userId },
      {
        $push: {
          books: {
            rating: req.body.rating,
            book: req.body.bookId,
          },
        },
      },
      { new: true },
    ));
  }
  const book = await Book.findOne({id:req.body.bookId});
  const updatedBook = await Book.findOneAndUpdate(
    { id: req.body.bookId },
    {
      $set: {
        avgRating: {
          ratings: book.avgRating.ratings + 1,
          rateValue:
            (book.avgRating.rateValue + req.body.rating) /
            (book.avgRating.ratings + 1),
          sumRatings: book.avgRating.sumRatings + req.body.rating,
        },
      },
    },
  );
  if ( !mongooseError )
    return res.status( 200 ).json( bookInUser );
  return next( mongooseError );
  
}

export default { register, login, rateBook };
