// Update multerConfig.js

import multer from "multer";
import path from "path";
import ValidationError from "../errors/validationError.js";

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const imageMimeTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
  if (imageMimeTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }
  cb(new ValidationError("Unsupported image format"), false);
};

const upload = multer({ 
  storage: fileStorage, 
  fileFilter,
  limits: {
    fieldSize: 1024 * 1024 * 5 // Set a limit on field size if needed
  }
}); // Update field name to "imageUrl"

export default upload;
