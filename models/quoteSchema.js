import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema({
    text: { type: String, required: true },
    active: { type: Boolean, default: false },
});

export default mongoose.model("Quote", quoteSchema, "quotes"); // explicitly use "quotes" collection
