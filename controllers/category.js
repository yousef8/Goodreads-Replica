import InternalError from "../errors/internalError.js";
import Category from "../models/category.js";
import asyncWrapper from "../utils/asyncWrapper.js";

async function create(req, res, next) {
  const [monogoErr, category] = await asyncWrapper(
    Category.create(req.category),
  );
  if (!monogoErr) return res.status(201).json(category);
  return next(monogoErr);
}

async function update(req, res, next) {
  const [monogoErr, updatedCategory] = await asyncWrapper(
    Category.findOneAndUpdate({ id: req.params.id }, req.category, {
      runValidators: true,
      new: true,
    }),
  );
  if (monogoErr) return next(monogoErr);
  if (!updatedCategory) return res.status(404).json({});
  return res.status(200).json(updatedCategory);
}

async function remove(req, res, next) {
  const [deletionError, deletedCategory] = await asyncWrapper(
    Category.findOneAndDelete({
      id: req.params.id,
    }),
  );

  if (deletionError) {
    next(new InternalError(deletionError.message));
    return;
  }

  if (!deletedCategory) {
    res.status(404).json({});
    return;
  }

  console.log(deletedCategory);
  res.status(204).json(deletedCategory);
}

async function getAll(req, res, next) {
  const [searchError, categories] = await asyncWrapper(Category.find());
  if (searchError) {
    next(new InternalError(searchError.message));
    return;
  }

  res.status(200).json(categories);
}

async function getOne(req, res, next) {
  const [searchError, category] = await asyncWrapper(
    Category.findOne({ id: req.params.id }),
  );

  if (searchError) {
    next(new InternalError(searchError.message));
    return;
  }
  res.status(200).json(category);
}

export default { create, update, remove, getAll, getOne };
