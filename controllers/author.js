import Author from "../models/author.js";
import asyncWrapper from "../utils/asyncWrapper.js";

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

export default { create };
