import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get("http://localhost:5000/api/cart", {
            headers: { Authorization: token },
          });
          setCart(res.data.items || []);
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      }
    };
    fetchCart();
  }, []);

  const addToCart = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    await axios.post(
      "http://localhost:5000/api/cart/add",
      { productId, quantity: 1 },
      { headers: { Authorization: token } }
    );
    setCart([...cart, { product: { _id: productId }, quantity: 1 }]);
  };

  const removeFromCart = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
      headers: { Authorization: token },
    });
    setCart(cart.filter((item) => item.product._id !== productId));
  };

  return <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>{children}</CartContext.Provider>;
};
