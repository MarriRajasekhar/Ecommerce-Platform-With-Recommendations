import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

// Get user cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from cart
export const removeFromCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsersAlsoBought = async (req, res) => {
  try {
    const { cartItems } = req.body; // Expecting an array of product IDs

    if (!cartItems || cartItems.length === 0) {
      return res.json([]); // No recommendations if cart is empty
    }

    // Find past orders that include these products
    const relatedOrders = await Order.find({
      "items.product": { $in: cartItems },
    }).populate("items.product");

    // Collect other frequently bought products
    const productCount = {};
    relatedOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (!cartItems.includes(item.product._id.toString())) { // Exclude cart items
          productCount[item.product._id] = (productCount[item.product._id] || 0) + 1;
        }
      });
    });

    // Sort products by most frequently bought together
    const sortedProductIds = Object.keys(productCount).sort(
      (a, b) => productCount[b] - productCount[a]
    );

    // Fetch product details
    const recommendedProducts = await Product.find({ _id: { $in: sortedProductIds } }).limit(4);

    res.json(recommendedProducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recommendations", error });
  }
};
