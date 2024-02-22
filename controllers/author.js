import InternalError from "../errors/internalError.js";
import Author from "../models/author.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import deleteFile from "../utils/deleteFile.js";

const defaultAuthorImage =
  "https://api.dicebear.com/7.x/big-ears/svg?seed=Oscar&backgroundColor=ffdfbf";

async function create(req, res, next) {
  const { firstName, lastName, dateOfBirth } = req.validReq;
  const [createError, author] = await asyncWrapper(
    Author.create({
      firstName,
      lastName,
      dateOfBirth,
      imageUrl: req.file ? `/${req.file.path}` : defaultAuthorImage,
    }),
  );

  if (createError) {
    next(createError);
    return;
  }

  res.status(201).json(author);
}

async function getAuthors(req, res, next) {
  const [searchError, authors] = await asyncWrapper(Author.find({}).exec());

  if (searchError) {
    next(new InternalError(searchError.message));
    return;
  }

  res.json(authors);
}

async function getAuthor(req, res, next) {
  const [searchError, author] = await asyncWrapper(
    Author.findOne({ id: req.params.id }),
  );

  if (searchError) {
    next(new InternalError(searchError.message));
  }

  res.json(author || {});
}

async function updateAuthor(req, res, next) {
  const [searchError, author] = await asyncWrapper(
    Author.findOne({ id: req.params.id }).exec(),
  );

  if (searchError) {
    next(new InternalError(searchError.message));
    return;
  }

  if (!author) {
    res.status(404).json({});
    return;
  }

  Object.entries(req.validReq).forEach(([key, value]) => {
    author[key] = value;
  });

  const oldImageUrl = req.file ? author.imageUrl : undefined;

  if (req.file) {
    author.imageUrl = `/${req.file.path}`;
  }

  const [saveError, newAuthor] = await asyncWrapper(author.save());

  if (saveError) {
    next(new InternalError(saveError.message));
    return;
  }

  if (oldImageUrl) {
    await deleteFile(oldImageUrl);
  }

  res.json(newAuthor);
}

async function deleteAuthor(req, res, next) {
  const [deleteError, deletedAuthor] = await asyncWrapper(
    Author.findOneAndDelete({ id: req.params.id }).exec(),
  );

  if (deleteError) {
    next(new InternalError(deleteError.message));
    return;
  }

  if (!deletedAuthor) {
    res.status(404).json({});
    return;
  }

  deleteFile(deletedAuthor.imageUrl);

  res.status(204).json({});
}

export default { create, getAuthors, getAuthor, updateAuthor, deleteAuthor };
