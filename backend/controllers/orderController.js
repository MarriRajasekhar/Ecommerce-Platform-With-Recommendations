import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// Place Order
export const placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) return res.status(400).json({ message: "Your cart is empty" });

    let totalAmount = 0;
    cart.items.forEach((item) => {
      totalAmount += item.product.dynamicPrice * item.quantity;
    });

    const newOrder = new Order({
      user: req.user.id,
      items: cart.items,
      totalAmount,
    });

    await newOrder.save();
    await Cart.findOneAndDelete({ user: req.user.id });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("items.product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Order Status (Admin Only)
export const updateOrderStatus = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Unauthorized" });

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's past orders
    const orders = await Order.find({ user: userId }).populate("items.product");

    if (!orders.length) {
      return res.json([]); // No recommendations if no past orders
    }

    // Count category frequency
    const categoryCount = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const category = item.product.category;
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
    });

    // Find most bought category
    const mostBoughtCategory = Object.keys(categoryCount).reduce((a, b) =>
      categoryCount[a] > categoryCount[b] ? a : b
    );

    // Fetch products from that category (excluding already bought ones)
    const boughtProductIds = orders.flatMap((order) => order.items.map((item) => item.product._id));

    const recommendedProducts = await Product.find({
      category: mostBoughtCategory,
      _id: { $nin: boughtProductIds }, // Exclude already purchased products
    })
      .limit(4);

    res.json(recommendedProducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recommendations", error });
  }
};
