import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import quoteRoutes from "./routes/quoteRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const SECRET_KEY = process.env.SECRET_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS
// app.use(cors({ origin: "http://localhost:5174", credentials: true }));
app.use(
    cors({
        origin: [
            "http://localhost:5174", // local dev
            /\.vercel\.app$/, // all Vercel preview + production domains
        ],
        credentials: true,
    })
);

app.use(express.json());

// Routes
app.use("/api/quotes", quoteRoutes);
app.use("/api/images", imageRoutes);
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static("uploads")); // 👈 serve static files

// Login / Date validation
app.post("/api/validate-date", (req, res) => {
    const { date } = req.body;

    if (!date) {
        return res.status(400).json({ error: "Date is required in DD-MM-YYYY format" });
    }

    // ✅ Normal user date
    if (date === "12-06-1996") {
        const token = jwt.sign({ role: "user" }, SECRET_KEY, { expiresIn: "1h" });

        return res.json({
            message: "User authenticated ✅",
            role: "user",
            token,
        });
    }

    // ✅ Admin date
    if (date === "05-05-0463") {
        const token = jwt.sign({ role: "admin" }, SECRET_KEY, { expiresIn: "1h" });

        return res.json({
            message: "Admin authenticated 👑",
            role: "admin",
            token,
        });
    }

    return res.status(401).json({ error: "Invalid date ❌" });
});

// Middleware to protect routes
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ error: "No token provided" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid or expired token" });

        req.user = user;
        next();
    });
}

// Example protected route
app.get("/api/secret-data", authenticateToken, (req, res) => {
    res.json({
        message: "🎉 This is protected data!",
        user: req.user,
    });
});

// Connect DB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
