import multer from "multer";
import path from "path"
import Book from "../models/books.js";
import asyncWrapper from "../utils/asyncWrapper.js";

const storageDisk = multer.diskStorage({
  destination(req, file, cb) {
    cb( null, "images/books" );
  },
  filename ( req, file, cb ) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "_") +
        file.originalname.replace(/\s+/g, ""),
    );
  },
});

const checkFileType = function (file, cb) {
  const fileTypes = /jpeg|jpg|png|gif|svg/;

  const mimeType = fileTypes.test(file.mimetype);

  if ( mimeType ) {
    return cb(null, true);
  } 
    return cb("Error: You can Only Upload Images!!");
  
};

const upload = multer({
  storage:storageDisk,
  fileFilter: ( req, file, cb ) => {
    checkFileType( file, cb );
  },
}); 

async function create ( req, res, next ) {
  const [mongoerr, book] = await asyncWrapper(Book.create(req.book));
  if (!mongoerr) {
    return res.status(200).json(book);
  }
  return next(mongoerr);
}

async function update(req, res, next) {
  const [monogoErr, book] = await asyncWrapper(
    Book.findOne({ id: req.params.id }),
  );
  if (monogoErr) return next(monogoErr);
  if (!book) {
    return res.sendStatus(404);
  }
  const [validErr, updatedBook] = await asyncWrapper(
    Book.updateOne({ id: req.params.id }, req.book, { runValidators: true }),
  );
  if (validErr) return next(validErr);
  return res.status(200).json(updatedBook);
}

async function getBook(req, res) {
  const book = await Book.find({ id: req.params.id });
  if (!book.length) return res.sendStatus(404);
  return res.status(200).json(book[0]);
}

async function remove(req, res) {
  const deletedBook = await Book.findOneAndDelete({ id: req.params.id });
  if (!deletedBook) return res.sendStatus(404);
  return res.status(200).json(deletedBook);
}

async function getAll(req, res) {
  const books = await Book.find();
  res.status(200).json(books);
}
export default {
  create,
  update,
  getBook,
  getAll,
  remove,
  upload,
};
