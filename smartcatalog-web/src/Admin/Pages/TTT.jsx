import { useState, useEffect, useRef } from "react";
import { Search, PlusCircle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const SearchProductList = ({ setAddedProducts }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [addedProducts, setLocalAddedProducts] = useState([]);
  const abortControllerRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ✅ โหลดข้อมูลตะกร้าจาก Backend เมื่อ Component ถูกโหลด
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!token) return;
        const response = await axios.get(`${BASE_URL}/api/carts/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLocalAddedProducts(response.data.cart.items);
      } catch (error) {
        console.error("โหลดตะกร้าไม่สำเร็จ:", error);
      }
    };
    fetchCart();
  }, [token]);

  // 🔍 ค้นหาสินค้าผ่าน API
  const fetchProducts = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await axios.get(
        `${BASE_URL}/api/newproducts/search?keyword=${encodeURIComponent(query)}`,
        { signal: abortController.signal }
      );
      setSuggestions(response.data.products || []);
    } catch {
      setSuggestions([]);
    }
  };

  const debouncedSearch = useRef(_.debounce(fetchProducts, 300)).current;

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery]);

  useEffect(() => {
    setAddedProducts(addedProducts);
  }, [addedProducts, setAddedProducts]);

  // ✅ เพิ่มสินค้าไปยังตะกร้าใน Backend
  const addProduct = async (product) => {
    try {
      if (!token) {
        alert("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้า");
        return;
      }
      const response = await axios.post(
        `${BASE_URL}/api/carts/`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLocalAddedProducts(response.data.cart.items);
    } catch (error) {
      console.error("ไม่สามารถเพิ่มสินค้าได้:", error);
    }
  };

  // ✅ อัปเดตจำนวนสินค้าใน Backend
  const updateQuantity = async (id, quantity) => {
    try {
      if (!token) return;
      await axios.put(
        `${BASE_URL}/api/carts/update`,
        { productId: id, quantity: Math.max(1, quantity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLocalAddedProducts((prev) =>
        prev.map((item) =>
          item.productId === id ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      );
    } catch (error) {
      console.error("อัปเดตจำนวนสินค้าไม่สำเร็จ:", error);
    }
  };

  // ✅ ลบสินค้าออกจากตะกร้าใน Backend
  const removeProduct = async (id) => {
    try {
      if (!token) return;
      await axios.delete(`${BASE_URL}/api/carts/remove`, {
        data: { productId: id },
        headers: { Authorization: `Bearer ${token}` },
      });
      setLocalAddedProducts((prev) => prev.filter((item) => item.productId !== id));
    } catch (error) {
      console.error("ลบสินค้าไม่สำเร็จ:", error);
    }
  };

  const totalPrice = addedProducts.reduce(
    (sum, product) => sum + (product.price || 0) * product.quantity,
    0
  );

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      {/* 🔎 ค้นหาสินค้า */}
      <div className="relative flex items-center gap-2 border rounded-lg p-2 bg-white shadow">
        <input
          type="text"
          placeholder="🔍 ค้นหาสินค้า..."
          className="flex-grow h-12 text-sm sm:text-base pl-4 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={() =>
            searchQuery.trim() && navigate(`/search?query=${encodeURIComponent(searchQuery)}`)
          }
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-3"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>

      {/* ✅ แสดงผลสินค้า */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {suggestions.map((product) => (
              <div key={product._id} className="border rounded-lg shadow-lg p-4 flex flex-col items-center bg-white">
                <img
                  src={product.images?.[0]?.fileName ? `${BASE_URL}/uploads/products/${product.images[0].fileName}` : ""}
                  alt={product.itemDescription || "ไม่มีชื่อสินค้า"}
                  className="w-32 h-32 object-cover rounded-md border mb-2"
                />
                <span className="text-sm font-medium text-gray-900 text-center w-full truncate max-w-[200px]">
                  {product.itemDescription || "ไม่มีชื่อสินค้า"}
                </span>
                <button
                  className="mt-auto bg-green-600 text-white w-full px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 transition duration-200"
                  onClick={() => addProduct(product)}
                >
                  <PlusCircle className="w-5 h-5" /> เพิ่มสินค้า
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 📦 รายการสินค้าที่เพิ่ม */}
        <div className="border rounded-lg shadow-lg p-4 bg-white md:max-h-full">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">📌 รายการที่เลือก</h3>
          <div className="max-h-96 md:max-h-full overflow-auto space-y-3">
            {addedProducts.length > 0 ? (
              addedProducts.map((product) => (
                <div key={product.productId} className="flex items-center bg-gray-100 p-3 rounded-lg shadow">
                  <span className="text-sm font-medium text-gray-900">{product.itemDescription}</span>
                  <input type="number" value={product.quantity} onChange={(e) => updateQuantity(product.productId, e.target.value)} className="w-12 border text-center mx-2" />
                  <button className="text-red-600 hover:text-red-800" onClick={() => removeProduct(product.productId)}>
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">ยังไม่มีสินค้าที่เลือก</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchProductList;
