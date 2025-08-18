import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { addImage, getImages, deleteImage } from "../controllers/imageController.js";

const router = express.Router();

// Ensure uploads folder exists
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

// Multer instance with file filter
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed!"), false);
        }
    },
});

// Routes
router.post("/", upload.single("image"), addImage);
router.get("/", getImages);
router.delete("/:id/:category", deleteImage);


export default router;
