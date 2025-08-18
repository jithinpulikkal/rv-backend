import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    path: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
});

// Each collection gets its own model
export const GalleryImage = mongoose.model("GalleryImage", imageSchema);
export const SecretImage = mongoose.model("SecretImage", imageSchema);
export const DrawingImage = mongoose.model("DrawingImage", imageSchema);
