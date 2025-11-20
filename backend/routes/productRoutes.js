import express from "express";
import { getProducts, addProduct, updateDynamicPricing, getProductById } from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/add", protect, addProduct);
router.put("/update-prices", updateDynamicPricing);
router.get("/:id", getProductById); // ✅ NEW ROUTE TO GET A SINGLE PRODUCT

export default router;
