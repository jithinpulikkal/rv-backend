import Quote from "../models/quoteSchema.js";

// Get all quotes
export const getQuotes = async (req, res) => {
    try {
        const quotes = await Quote.find();
        res.json(quotes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a quote
export const addQuote = async (req, res) => {
    try {
        const newQuote = await Quote.create({ text: req.body.text });
        res.status(201).json(newQuote);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a quote
export const deleteQuote = async (req, res) => {
    try {
        await Quote.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Activate a quote (only one active at a time)
export const activateQuote = async (req, res) => {
    try {
        await Quote.updateMany({}, { active: false }); // deactivate all
        const updated = await Quote.findByIdAndUpdate(req.params.id, { active: true }, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Deactivate a quote
export const deactivateQuote = async (req, res) => {
    try {
        const updated = await Quote.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get active quote
export const getActiveQuote = async (req, res) => {
    try {
        const activeQuote = await Quote.findOne({ active: true });
        if (!activeQuote) {
            return res.status(404).json({ message: "No active quote found" });
        }
        res.json(activeQuote);
    } catch (err) {
        res.status(500).json({ error: "Server error while fetching active quote" });
    }
};
