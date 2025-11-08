import express from "express";
import { checkout } from "../controllers/cartController.js";

const router = express.Router();

// POST /api/checkout
router.post("/checkout", checkout);

export default router;
