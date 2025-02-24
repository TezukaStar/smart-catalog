import { Repeat } from "lucide-react"; // ✅ นำเข้าไอคอน Repeat จาก Lucide React
import PropTypes from "prop-types"; // ✅ ใช้ PropTypes เพื่อตรวจสอบข้อมูลสินค้า
import { useNavigate } from "react-router-dom"; // ✅ ใช้ useNavigate สำหรับเปลี่ยนเส้นทางไปยังหน้าการเปรียบเทียบสินค้า

// ✅ กำหนด BASE_URL สำหรับอัปโหลดรูปภาพ
const BASE_URL = "http://localhost:3000"; // 🔥 เปลี่ยนให้ตรงกับ Backend

export default function Product({ product = {} }) {
  console.log("📸 React ได้รับข้อมูลสินค้า:", product); // ✅ Debug ข้อมูลสินค้า

  const navigate = useNavigate(); // ✅ ใช้ useNavigate() เพื่อเปลี่ยนเส้นทางเมื่อกดปุ่มเปรียบเทียบ

  // ✅ ตรวจสอบว่าสินค้ามีรูปภาพหรือไม่
  const hasImage = product?.images?.length > 0 && product.images[0]?.fileName;

  return (
    <div 
      className="
        relative p-2 shadow-lg rounded-xl bg-white border border-gray-200
        w-full sm:w-[220px] md:w-[250px] lg:w-[290px] xl:w-[320px]
        h-[500px] sm:h-[280px] md:h-[350px] lg:h-[390px] xl:h-[420px]
        flex flex-col justify-between
      "
    >
      {/* ✅ แสดงแบรนด์สินค้า (ถ้ามี) */}
      <p className="absolute top-3 left-3 text-sm text-gray-500 font-semibold">
        {product.brand || "ไม่ระบุแบรนด์"}
      </p>

      {/* ✅ แสดงแท็ก SPEC ICT ถ้าสินค้าอยู่ในหมวดหมู่ ICT */}
      {product.specICT && (
        <div 
          className="absolute top-0 right-0 bg-white border-2 border-gray-300 
          text-green-600 text-lg font-bold px-3 py-1
          rounded-bl-xl shadow-md flex items-center justify-center"
        >
          ICT
        </div>
      )}

      {/* ✅ ส่วนแสดงรูปสินค้า */}
      <div className="w-full h-auto min-h-[200px] flex justify-center items-center mt-9">
        {hasImage ? (
          <img
            src={`${BASE_URL}/uploads/products/${product.images[0].fileName}`}
            alt={product.itemDescription || "ไม่มีชื่อสินค้า"}
            className="max-w-full max-h-full object-contain"
            onError={(e) => e.target.src = "/placeholder-image.jpg"}
          />
        ) : (
          <p className="text-center text-gray-400 italic">ไม่มีรูปสินค้า</p>
        )}
      </div>

      {/* ✅ แสดงชื่อสินค้า โดยใช้ `itemDescription` ถ้า `name` ไม่มีค่า */}
      <p className="text-sm font-semibold mt-2 text-center line-clamp-2 px-2">
        {product.name || product.itemDescription || "ไม่มีชื่อสินค้า"}
      </p>

      {/* ✅ แสดงราคาสินค้า */}
      <p className="text-green-600 font-bold text-lg text-center">
        {product.price != null ? `฿${product.price.toLocaleString()}` : "ไม่ระบุราคา"}
      </p>

      {/* ✅ ปุ่มเปรียบเทียบสินค้า */}
      <button
        className="w-full mt-2 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-1"
        onClick={() => navigate(`/compare?product=${encodeURIComponent(product.name || product.itemDescription || "unknown")}`)}
      >
        <Repeat size={20} /> เปรียบเทียบ
      </button>
    </div>
  );
}

// ✅ ตรวจสอบ `props` ของ `product`
Product.propTypes = {
  product: PropTypes.shape({
    brand: PropTypes.string, // ✅ ชื่อแบรนด์
    name: PropTypes.string, // ✅ ชื่อสินค้า
    itemDescription: PropTypes.string, // ✅ คำอธิบายสินค้า (ถ้าไม่มี name)
    price: PropTypes.number, // ✅ ราคาสินค้า
    specICT: PropTypes.bool, // ✅ หมวด ICT หรือไม่
    images: PropTypes.arrayOf( // ✅ รูปภาพสินค้า
      PropTypes.shape({
        fileName: PropTypes.string, // ✅ ชื่อไฟล์รูป
      })
    ),
  }),
};
