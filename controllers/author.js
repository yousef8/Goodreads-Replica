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
    next(new InternalError("Something went wrong with search operation"));
    return;
  }

  res.json(authors);
}

async function getAuthor(req, res, next) {
  const [searchError, author] = await asyncWrapper(
    Author.findOne({ id: req.params.id }),
  );

  if (searchError) {
    next(new InternalError("Something went wrong with search operation"));
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

  let oldImageUrl;
  if (req.file) {
    oldImageUrl = author.imageUrl;
    author.imageUrl = `/${req.file.path}`;
  }

  const [saveError, newAuthor] = await asyncWrapper(author.save());

  if (saveError) {
    next(new InternalError(saveError));
    return;
  }

  if (oldImageUrl) {
    const deleteImageError = await deleteFile(oldImageUrl);
    if (deleteImageError) {
      console.log(`Couldn't delete image: ${deleteImageError.message}`);
    }
  }

  res.json(newAuthor);
}

async function deleteAuthor(req, res, next) {
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

  const imagePath = author.imageUrl;

  const [deleteAuthorError] = await asyncWrapper(author.deleteOne());

  if (deleteAuthorError) {
    next(new InternalError(deleteAuthorError.message));
    return;
  }

  const deleteImageError = await deleteFile(imagePath);
  if (deleteImageError) {
    console.log(`Couldn't delete image: ${deleteImageError.message}`);
  }

  res.status(204).json({});
}

export default { create, getAuthors, getAuthor, updateAuthor, deleteAuthor };
