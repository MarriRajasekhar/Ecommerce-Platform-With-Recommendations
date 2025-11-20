import Product from "../models/productModel.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const addProduct = async (req, res) => {
  try {
    const { name, price, stock, category, image } = req.body;

    const newProduct = await Product.create({
      name,
      price,
      stock,
      category,
      image,
      dynamicPrice: price, // Initially, dynamic price is same as base price
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Price Dynamically
export const updateDynamicPricing = async (req, res) => {
  try {
    const products = await Product.find();
    
    for (const product of products) {
      if (product.sold > 10) {
        product.dynamicPrice = product.price * 1.1; // 10% Increase
      } else {
        product.dynamicPrice = product.price; // Reset to base price
      }
      await product.save();
    }

    res.json({ message: "Prices updated dynamically" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Invalid product ID" });
  }
};

