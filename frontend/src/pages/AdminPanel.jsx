import { useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Ensure you're logged in
      await axios.post("http://localhost:5000/api/products/add", formData, {
        headers: { Authorization: token },
      });
      alert("🔥 Product Added Successfully!");
      setFormData({ name: "", price: "", stock: "", category: "", image: "" });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-center mb-6">Add Product</h1>
      <form className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Product Name" className="w-full p-2 border mb-3" onChange={handleChange} value={formData.name} />
        <input type="number" name="price" placeholder="Price" className="w-full p-2 border mb-3" onChange={handleChange} value={formData.price} />
        <input type="number" name="stock" placeholder="Stock" className="w-full p-2 border mb-3" onChange={handleChange} value={formData.stock} />
        <input type="text" name="category" placeholder="Category" className="w-full p-2 border mb-3" onChange={handleChange} value={formData.category} />
        <input type="text" name="image" placeholder="Image URL" className="w-full p-2 border mb-3" onChange={handleChange} value={formData.image} />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Add Product</button>
      </form>
    </div>
  );
};

export default AdminPanel;
