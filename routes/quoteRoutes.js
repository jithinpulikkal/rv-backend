import express from "express";
import {
    getQuotes,
    addQuote,
    deleteQuote,
    activateQuote,
    deactivateQuote,
    getActiveQuote,
} from "../controllers/quoteController.js";

const router = express.Router();

router.get("/", getQuotes);
router.post("/", addQuote);
router.delete("/:id", deleteQuote);
router.put("/:id/activate", activateQuote);
router.put("/:id/deactivate", deactivateQuote);
router.get("/active", getActiveQuote);

export default router;
