import { useState, useEffect } from "react";
import ProductCard from "./ProductCard2";
import newIcon from "../../assets/Image/New.png"; 

export default function LatestProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/newProducts")
      .then((res) => res.json())
      .then((data) => {
        const latestProducts = data.products.slice(-4).reverse(); // ดึงสินค้าล่าสุด 4 รายการ
        setProducts(latestProducts);
      })
      .catch((err) => console.error("Error fetching latest products:", err));
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg w-full mx-auto px-4 sm:px-8 md:px-20"> {/* ปรับระยะห่างของขอบจอให้ responsive */}
      <div className="flex items-center mb-4">
        <img src={newIcon} alt="New" className="w-16 h-16 mr-4" />
        <h2 className="text-3xl font-bold">สินค้าแนะนำ</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full"> {/* ใช้ grid layout ป้องกันการซ้อนทับ */}
        {products.map((product) => (
          <div key={product._id} className="w-full flex justify-center"> {/* จัดตำแหน่งสินค้าให้ตรงกลาง */}
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
