import { unlink } from "node:fs/promises";
import asyncWrapper from "./asyncWrapper.js";

async function deleteFile(filePath) {
  const [error] = await asyncWrapper(unlink(`.${filePath}`));
  if (error) {
    console.log(`Couldn't delete file: ${error.message}`);
  }

  return error;
}

export default deleteFile;
