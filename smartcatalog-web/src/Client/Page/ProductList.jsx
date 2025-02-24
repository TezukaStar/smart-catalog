import { useState, useEffect } from "react";
import ProductCard from "../Component/Desktop/Product/ProductCard"; // ✅ ใช้ ProductCard เพื่อแสดงสินค้าแต่ละตัว

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">สินค้าทั้งหมด</h2>
      <div className="grid grid-cols-1  gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
