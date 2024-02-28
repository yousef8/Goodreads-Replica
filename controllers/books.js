import Book from "../models/books.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import InternalError from "../errors/internalError.js";
import deleteFile from "../utils/deleteFile.js";

const defaultBookImage =
  "https://api.dicebear.com/7.x/icons/svg?icon=book&backgroundColor=ffdfbf";

async function create(req, res, next) {
  const { name, authorId: author, categoryId: category } = req.book;
  const [mongoerr, book] = await asyncWrapper(
    Book.create({
      name,
      author,
      category,
      imageUrl: req.file ? req.file.path : defaultBookImage,
    }),
  );
  if (!mongoerr) {
    return res.status(201).json(book);
  }
  return next(mongoerr);
}

async function update(req, res, next) {
  const [monogoErr, book] = await asyncWrapper(
    Book.findOne({ id: req.params.id }),
  );

  if (monogoErr) return next(monogoErr);

  if (!book) {
    return res.status(404).json({});
  }

  const { authorId, categoryId, ...rest } = req.book;
  if (authorId) book.author = authorId;
  if (categoryId) book.category = categoryId;
  Object.assign(book, rest);

  let imageOldUrl;
  console.log(req.file);
  if (req.file) {
    imageOldUrl = book.imageUrl;
    book.imageUrl = req.file.path;
  }
  console.log(book);

  const [saveError, newBook] = await asyncWrapper(book.save());

  if (saveError) return next(new InternalError(saveError.message));

  deleteFile(imageOldUrl);

  return res.status(200).json(newBook);
}

async function getBook(req, res, next) {
  const [searchError, book] = await asyncWrapper(
    Book.findOne({ id: req.params.id })
      .populate({ path: "author", model: "Author", foreignField: "id" })
      .populate({ path: "category", model: "Category", foreignField: "id" })
      .exec(),
  );

  if (searchError) {
    next(new InternalError(searchError.message));
    return;
  }

  if (!book) {
    res.status(404).json({});
    return;
  }

  res.status(200).json(book);
}

async function remove(req, res, next) {
  const [deleteError, deletedBook] = await asyncWrapper(
    Book.findOneAndDelete({ id: req.params.id }).exec(),
  );

  if (deleteError) {
    next(new InternalError(deleteError.message));
    return;
  }

  if (!deletedBook) {
    res.status(404).json({});
    return;
  }

  deleteFile(deletedBook.imageUrl);

  res.status(204).json(deletedBook);
}

async function getAll(req, res, next) {
  const { categoryId } = req.query;
  const query = categoryId ? { categoryId } : {};

  const [searchError, books] = await asyncWrapper(
    Book.find(query)
      .populate({ path: "author", model: "Author", foreignField: "id" })
      .populate({ path: "category", model: "Category", foreignField: "id" })
      .exec(),
  );

  if (searchError) {
    next(new InternalError(searchError.message));
    return;
  }

  res.status(200).json(books);
}

export default {
  create,
  update,
  getBook,
  getAll,
  remove,
};
