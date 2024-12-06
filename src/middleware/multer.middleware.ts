import multer from "multer";
import fs from "fs";
import path from "path";

const dir = path.resolve(path.join(__dirname, "../../../src/uploads"));

const imageDir = path.resolve(
  path.join(__dirname, "../../../src/uploads/images")
);
const soundsDir = path.resolve(
  path.join(__dirname, "../../../src/uploads/sounds")
);
const videosDir = path.resolve(
  path.join(__dirname, "../../../src/uploads/videos")
);

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir);
}
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir);
}
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (
      !file.mimetype.includes("image") &&
      !file.mimetype.includes("audio") &&
      !file.mimetype.includes("video")
    ) {
      return cb(new Error(`Invalid file type`), null);
    }

    if (file.mimetype.includes("image")) cb(null, imageDir);
    if (file.mimetype.includes("audio")) cb(null, soundsDir);
    if (file.mimetype.includes("video")) cb(null, videosDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

const upload = multer({ storage: storage });
export default upload;
