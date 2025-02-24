import { useState, useEffect } from "react";
import { Search, PlusCircle, Trash2 } from "lucide-react";
import axios from "axios";


const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const SearchProductList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [addedProducts, setLocalAddedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/carts/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLocalAddedProducts(response.data.cart.items);
      } catch (error) {
        console.error("❌ โหลดตะกร้าไม่สำเร็จ:", error);
      }
    };
    fetchCart();
  }, [token]);

  useEffect(() => {
    setTotalPrice(
      addedProducts.reduce(
        (sum, product) =>
          sum + (product.productId?.price || 0) * product.quantity,
        0
      )
    );
  }, [addedProducts]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/newproducts/search?keyword=${encodeURIComponent(
            searchQuery
          )}`
        );
        setSuggestions(response.data.products || []);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ✅ ปรับแก้ให้กดสินค้าซ้ำเพิ่มจำนวนแทนเพิ่มรายการใหม่
  const addProduct = async (product) => {
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้า");
      return;
    }

    const existingProduct = addedProducts.find(
      (item) => item.productId._id === product._id
    );

    if (existingProduct) {
      const updatedQuantity = existingProduct.quantity + 1;

      // ✅ อัปเดต UI ทันที (Optimistic UI)
      setLocalAddedProducts((prevProducts) =>
        prevProducts.map((item) =>
          item.productId._id === product._id
            ? { ...item, quantity: updatedQuantity }
            : item
        )
      );

      // ✅ อัปเดต API ไปที่ backend
      try {
        await axios.put(
          `${BASE_URL}/api/carts/update`,
          { productId: product._id, quantity: updatedQuantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("❌ ไม่สามารถเพิ่มสินค้าได้:", error);
      }
    } else {
      try {
        await axios.post(
          `${BASE_URL}/api/carts/`,
          { productId: product._id, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLocalAddedProducts([
          ...addedProducts,
          { productId: product, quantity: 1 },
        ]);
      } catch (error) {
        console.error("❌ ไม่สามารถเพิ่มสินค้าได้:", error);
      }
    }
  };

  const removeProduct = async (id) => {
    if (!token) return;

    const previousProducts = [...addedProducts];

    setLocalAddedProducts(
      addedProducts.filter((item) => item.productId._id !== id)
    );

    try {
      await axios.delete(`${BASE_URL}/api/carts/removeItem`, {
        data: { productId: id },
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("❌ ลบสินค้าไม่สำเร็จ:", error);
      setLocalAddedProducts(previousProducts);
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (!token) return;

    if (quantity <= 0) {
      await removeProduct(id);
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/api/carts/update`,
        { productId: id, quantity: Math.max(1, quantity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLocalAddedProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productId._id === id ? { ...product, quantity } : product
        )
      );
    } catch (error) {
      console.error("❌ อัปเดตจำนวนสินค้าไม่สำเร็จ:", error);
    }
  };

  return (
      <div className="container mx-auto p-4 w-full">
        {/* 🔎 ค้นหาสินค้า */}
        <div className="relative flex items-center gap-2 border rounded-lg p-2 bg-white shadow">
          <input
            type="text"
            placeholder="🔍 ค้นหาสินค้า..."
            className="flex-grow h-12 text-xl sm:text-base pl-4 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* ✅ Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* ✅ แสดงรายการสินค้าที่ค้นหา */}
          <div className="md:col-span-2 lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {suggestions.map((product) => (
              <div
                key={product._id}
                className="border rounded-lg shadow-lg p-4 flex flex-col items-center bg-white w-full"
              >
                {/* ✅ ตรวจสอบว่ามีรูปภาพหรือไม่ */}
                {product.images && product.images.length > 0 ? (
                  <img
                    src={`${BASE_URL}/uploads/products/${product.images[0].fileName}`}
                    alt={product.itemDescription || "ไม่มีชื่อสินค้า"}
                    className="w-32 h-32 object-cover rounded-md border mb-2"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/no-image.png"; // ✅ ใช้ fallback ถ้าภาพโหลดไม่ได้
                    }}
                  />
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center border bg-gray-200 text-gray-500 text-sm rounded-md mb-2">
                    ไม่มีรูปสินค้า
                  </div>
                )}

                <span className="text-base font-medium text-gray-900 text-center w-full truncate max-w-[180px] mb-1">
                  {product.itemDescription || "ไม่มีชื่อสินค้า"}
                </span>
                <p className="text-base text-gray-600 mb-2">
                  ราคา: {product.price?.toLocaleString() || 0} ฿
                </p>
                <button
                  className="mt-auto bg-green-600 text-white w-full sm:px-3 sm:py-1 md:px-4 md:py-2 lg:px-5 lg:py-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 transition duration-200 text-xs sm:text-sm md:text-base"
                  onClick={() => addProduct(product)}
                >
                  <PlusCircle className="w-5 h-5" />
                  <span className="text-center">เพิ่มสินค้า</span>
                </button>
              </div>
            ))}
          </div>

          {/* 📦 รายการสินค้าที่เลือก */}
          <div className="md:col-span-2 lg:col-span-1 border rounded-lg shadow-lg p-5 bg-white w-full">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              📌 รายการที่เลือก
            </h3>
            <div className="max-h-96 overflow-auto space-y-3">
              {addedProducts.length > 0 ? (
                addedProducts.map((product) => (
                  <div
                    key={product.productId._id}
                    className="flex items-center bg-gray-100 p-3 rounded-lg shadow w-full"
                  >
                    {/* ✅ ตรวจสอบรูปสินค้า */}
                    {product.productId?.images &&
                    product.productId?.images.length > 0 ? (
                      <img
                        src={`${BASE_URL}/uploads/products/${product.productId.images[0].fileName}`}
                        alt={
                          product.productId?.itemDescription ||
                          "ไม่มีชื่อสินค้า"
                        }
                        className="w-16 h-16 object-cover rounded-md border"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/no-image.png"; // ✅ ใช้ fallback หากรูปโหลดไม่ได้
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center border bg-gray-200 text-gray-500 text-xs rounded-md">
                        ไม่มีรูปสินค้า
                      </div>
                    )}

                    <span className="text-sm font-medium text-gray-900 flex-grow px-2 truncate max-w-[180px]">
                      {product.productId?.itemDescription || "ไม่มีชื่อสินค้า"}
                    </span>
                    <span className="text-sm text-gray-600 px-2">
                      {product.productId?.price?.toLocaleString() || 0} ฿
                    </span>
                    <input
                      type="number"
                      className="w-12 border text-center mx-2 rounded-lg"
                      value={product.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          product.productId._id,
                          Number(e.target.value)
                        )
                      }
                      min="1"
                    />
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => removeProduct(product.productId._id)}
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  ยังไม่มีสินค้าที่เลือก
                </p>
              )}
            </div>

            {/* 💰 แสดงราคารวม อยู่ในช่อง รายการเลือกสินค้า */}
            <div className="mt-4 text-right border-t pt-3">
              <h4 className="text-lg font-semibold text-gray-800">
                ราคารวม:{" "}
                <span className="text-blue-600">
                  {totalPrice.toLocaleString()} ฿
                </span>
              </h4>
            </div>
          </div>
        </div>
      </div>
  );
};

// ✅ ส่งออก Component
export default SearchProductList;
