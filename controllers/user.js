import jwt from "jsonwebtoken";
import User from "../models/user.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import ValidationError from "../errors/validationError.js";
import Book from "../models/books.js";

const defaultUserImage = "images/userDefaultImage.svg";

async function register(req, res, next) {
  const [mongooseError, user] = await asyncWrapper(
    new User({
      ...req.validReq,
      imageUrl: req.file ? req.file.path : defaultUserImage,
    }).save(),
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

  const token = jwt.sign(
    { userId: user._id, isAdmin: user.isAdmin },
    process.env.SECRET,
    {
      expiresIn: "1d",
    },
  );
  return res.status(200).json({ token });
}

async function addBookToUser(req, res, next) {
  const userId = req.user._id;
  const { bookId } = req.body;
  const { shelf } = req.query;

  const allowedShelves = ["currentlyReading", "wantToRead", "read"];
  if (!allowedShelves.includes(shelf)) {
    return res.status(400).json({ message: "Invalid shelf value" });
  }

  try {
    const book = await Book.findOne({ id: bookId });
    if (!book) {
      return res.status(400).json({ message: "Book not found" });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        books: {
          book: bookId,
        },
      },
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        books: { book: bookId, shelf },
      },
    }).exec();

    return res.status(201).json({});
  } catch (error) {
    return next(error);
  }
}

async function retrieveUserBooks(req, res, next) {
  const { shelf } = req.query;

  try {
    let query;
    if (shelf && shelf.toLowerCase() !== "all") {
      const filteredBooks = req.user.books.filter(
        (book) => book.shelf === shelf,
      );
      query = { books: filteredBooks };
    } else {
      query = { books: req.user.books };
    }

    const queryModel = new User({ books: query.books });

    await queryModel.populate({
      path: "books.book",
      model: "Book",
      foreignField: "id",
    });

    res.json(queryModel.books);
  } catch (error) {
    next(error);
  }
}

async function updateUserBook(req, res, next) {
  const userId = req.user._id;
  const { bookId } = req.body;
  const { shelf } = req.query;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const book = user.books.find((item) => item.book.toString() === bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (typeof shelf === "string") {
      book.shelve = shelf;
      await user.save();
      return res.status(200).json({});
    }
    return res.status(400).json({ message: "Invalid shelf value" });
  } catch (error) {
    return next(error);
  }
}

async function removeUserBook(req, res, next) {
  const userId = req.user._id;
  const { bookId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const bookIndex = user.books.findIndex(
      (item) => item.book.toString() === bookId,
    );
    if (bookIndex === -1) {
      return res.status(404).json({ message: "Book not found" });
    }
    const removedBook = user.books.splice(bookIndex, 1)[0];
    await user.save();
    return res.status(200).json({});
  } catch (error) {
    return next(error);
  }
}

async function rateBook(req, res, next) {
  let [mongooseError, bookInUser] = await asyncWrapper(
    User.findOneAndUpdate(
      { _id: req.user._id, "books.book": req.body.bookId },
      {
        $set: {
          "books.$.rating": req.body.rating,
        },
      },
      { new: true },
    ),
  );
  console.log(bookInUser);
  if (!bookInUser) {
    [mongooseError, bookInUser] = await asyncWrapper(
      User.findByIdAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            books: {
              rating: req.body.rating,
              book: req.body.bookId,
            },
          },
        },
        { new: true },
      ),
    );
  }
  const [err, book] = await asyncWrapper(Book.findOne({ id: req.body.bookId }));
  if (err) return next(err);
  if (!book) {
    next(new ValidationError(`no book with id :${req.body.bookId}`));
    return;
  }
  const [updateError, updatedBook] = await asyncWrapper(
    Book.findOneAndUpdate(
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
    ),
  );

  if (updateError) {
    console.log(updateError);
    next(updateError);
    return;
  }

  if (!mongooseError) return res.status(200).json(bookInUser);
  next(mongooseError);
}

export default {
  register,
  login,
  rateBook,
  addBookToUser,
  retrieveUserBooks,
  updateUserBook,
  removeUserBook,
};
