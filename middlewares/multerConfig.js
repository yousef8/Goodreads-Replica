import multer from "multer";
import ValidationError from "../errors/validationError.js";

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${new Date().toISOString().replace(/:/g, "-")}-${file.originalname}`,
    );
  },
});

const fileFilter = (req, file, cb) => {
  const imageMimeTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/webp",
    "image/svg+xml",
  ];
  if (imageMimeTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }
  cb(new ValidationError("Unsupported image format"), false);
};

const upload = multer({ storage: fileStorage, fileFilter });

export default upload;
