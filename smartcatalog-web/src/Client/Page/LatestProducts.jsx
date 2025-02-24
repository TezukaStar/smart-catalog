// import { useState, useEffect } from "react";
// import ProductCard from "./ProductCard";
// import newIcon from "../../assets/Image/New.png"; 

// export default function LatestProducts() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:3000/api/newproducts")
//       .then((res) => res.json())
//       .then((data) => {
//         const latestProducts = data.slice(-4).reverse(); // ดึงสินค้าล่าสุด 4 รายการ
//         setProducts(latestProducts);
//       })
//       .catch((err) => console.error("Error fetching latest products:", err));
//   }, []);

//   return (
//     <div className="bg-white p-6 rounded-lg w-full mx-auto px-4 sm:px-8 md:px-20"> {/* ปรับระยะห่างของขอบจอให้ responsive */}
//       <div className="flex items-center mb-4">
//         <img src={newIcon} alt="New" className="w-16 h-16 mr-4" />
//         <h2 className="text-3xl font-bold">สินค้าแนะนำ</h2>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full"> {/* ใช้ grid layout ป้องกันการซ้อนทับ */}
//         {products.map((product) => (
//           <div key={product._id} className="w-full flex justify-center"> {/* จัดตำแหน่งสินค้าให้ตรงกลาง */}
//             <ProductCard product={product} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import ProductCard from "./Card Layout";
import newIcon from "../../assets/Image/New.png";

export default function LatestProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/newProducts");
        const data = await response.json();

        console.log("📌 API Response:", data); // ✅ Debug ข้อมูลที่ได้จาก API

        if (Array.isArray(data) && data.length > 0) {
          const latestProducts = data.slice(-4).reverse(); // ดึงสินค้าล่าสุด 4 รายการ
          setProducts(latestProducts);
        } else {
          console.warn("⚠️ ไม่มีสินค้าในระบบ");
          setProducts([]); // ✅ ตั้งค่าให้ `products` เป็น array ว่าง ถ้าไม่มีข้อมูล
        }
      } catch (error) {
        console.error("❌ Error fetching latest products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg w-full mx-auto px-4 sm:px-8 md:px-20">
      <div className="flex items-center mb-4">
        <img src={newIcon} alt="New" className="w-16 h-16 mr-4" />
        <h2 className="text-3xl font-bold">สินค้าแนะนำ</h2>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">⏳ กำลังโหลดข้อมูลสินค้า...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-red-500">❌ ไม่มีสินค้าแนะนำในขณะนี้</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {products.map((product) => (
            <div key={product._id} className="w-full flex justify-center">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
