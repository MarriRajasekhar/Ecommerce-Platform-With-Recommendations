import express from "express";
import { placeOrder, getUserOrders, updateOrderStatus, getRecommendedProducts } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/place", protect, placeOrder);
router.get("/", protect, getUserOrders);
router.put("/update/:orderId", protect, updateOrderStatus);
router.get("/recommendations", protect, getRecommendedProducts);

export default router;
