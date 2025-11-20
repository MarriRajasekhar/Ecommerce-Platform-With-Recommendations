import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
  category: String,
  dynamicPrice: Number, // Price that changes dynamically
  image: String,
  sold: { type: Number, default: 0 }, // Track sales for recommendations
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
