import { unlink } from "node:fs/promises";
import asyncWrapper from "./asyncWrapper.js";

async function deleteFile(filePath) {
  const [error] = await asyncWrapper(unlink(`.${filePath}`));
  return error;
}

export default deleteFile;
