import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Admin = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const resProducts = await axios.get("http://localhost:5000/api/products");
      const resOrders = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: token },
      });
      setProducts(resProducts.data);
      setOrders(resOrders.data);
    };

    if (user?.isAdmin) fetchData();
  }, [user]);

  if (!user?.isAdmin) return <div className="text-center text-lg mt-10">Access Denied.</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

      {/* Product Management */}
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-gray-600">₹{product.dynamicPrice.toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Order Management */}
      <h2 className="text-2xl font-bold mt-8 mb-4">Orders</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">Order #{order._id}</h3>
            <p className="text-gray-700">Total: ₹{order.totalAmount.toFixed(2)}</p>
            <p className="text-gray-500">Status: {order.status}</p>
            <button
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              onClick={async () => {
                await axios.put(
                  `http://localhost:5000/api/orders/update/${order._id}`,
                  { status: "Shipped" },
                  { headers: { Authorization: localStorage.getItem("token") } }
                );
                window.location.reload();
              }}
            >
              Mark as Shipped
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
