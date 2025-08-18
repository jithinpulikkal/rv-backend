import fs from "fs";
import path from "path";
import { GalleryImage, SecretImage, DrawingImage } from "../models/imageSchema.js";

// Pick model based on category
const getModel = (category) => {
    switch (category) {
        case "gallery":
            return GalleryImage;
        case "secret":
            return SecretImage;
        case "drawing":
            return DrawingImage;
        default:
            return null;
    }
};

// Add (Upload) Image
export const addImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });
        if (!req.body.category) return res.status(400).json({ error: "Category is required" });

        const Model = getModel(req.body.category);
        if (!Model) return res.status(400).json({ error: "Invalid category" });

        const newImage = new Model({
            path: `/uploads/${req.file.filename}`,
        });

        await newImage.save();

        res.status(201).json({
            _id: newImage._id,
            path: newImage.path,
            url: `${req.protocol}://${req.get("host")}${newImage.path}`,
        });
    } catch (err) {
        res.status(500).json({ error: "Error uploading image", details: err.message });
    }
};

// Get Images
export const getImages = async (req, res) => {
    try {
        const { category } = req.query;
        if (!category) return res.status(400).json({ error: "Category is required" });

        const Model = getModel(category);
        if (!Model) return res.status(400).json({ error: "Invalid category" });

        const images = await Model.find();

        res.json(
            images.map((img) => ({
                _id: img._id,
                path: img.path,
                url: `${req.protocol}://${req.get("host")}${img.path}`,
                uploadedAt: img.uploadedAt,
            }))
        );
    } catch (err) {
        res.status(500).json({ error: "Error fetching images", details: err.message });
    }
};

// Delete Image
// export const deleteImage = async (req, res) => {
//     try {
//         const { category } = req.query;
//         if (!category) return res.status(400).json({ error: "Category is required" });

//         const Model = getModel(category);
//         if (!Model) return res.status(400).json({ error: "Invalid category" });

//         const image = await Model.findByIdAndDelete(req.params.id);
//         if (!image) return res.status(404).json({ error: "Image not found" });

//         // Delete file from disk
//         const filePath = path.join(process.cwd(), image.path);
//         if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

//         res.json({ message: "Image deleted successfully" });
//     } catch (err) {
//         res.status(500).json({ error: "Error deleting image", details: err.message });
//     }
// };

export const deleteImage = async (req, res) => {
    const { id, category } = req.params;

    try {
        if (!category) return res.status(400).json({ error: "Category is required" });

        const Model = getModel(category);
        if (!Model) return res.status(400).json({ error: "Invalid category" });

        const image = await Model.findByIdAndDelete(id);
        if (!image) return res.status(404).json({ error: "Image not found" });

        // Delete file from disk
        const filePath = path.join(process.cwd(), image.path);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        res.json({ message: "Image deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting image", details: err.message });
    }
};
