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

  const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
    expiresIn: "1d",
  });
  return res.status(200).json({ token, user });
}

async function addBookToUser(req, res, next) {
  const userId = req.user._id;
  const { bookId } = req.body;
  const { shelf, rating } = req.query;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const book = await Book.findOne({ id: bookId });
    if (!book) {
      return res.status(400).json({ message: "Book not found" });
    }

    const allowedShelves = ["currentlyReading", "wantToRead", "read"];
    if (!allowedShelves.includes(shelf)) {
      return res.status(400).json({ message: "Invalid shelf value" });
    }

    user.books.push({
      shelve: shelf,
      rating,
      book: bookId,
    });

    await user.save();

    return res.status(201).json({});
  } catch (error) {
    return next(error);
  }
}

async function retrieveUserBooks(req, res, next) {
  const userId = req.user._id;
  const { shelf } = req.query;

  try {
    const user = await User.findById(userId, "books");

    let query;
    if (shelf && shelf.toLowerCase() !== "all") {
      console.log(user.books);
      const filteredBooks = user.books.filter((book) => book.shelve === shelf);
      query = { books: filteredBooks };
    } else {
      query = { books: user.books };
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

export default {
  register,
  login,
  addBookToUser,
  retrieveUserBooks,
  updateUserBook,
  removeUserBook,
};
