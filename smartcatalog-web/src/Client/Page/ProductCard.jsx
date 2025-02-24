import { Repeat } from "lucide-react"; // ✅ นำเข้าไอคอน Repeat จาก Lucide React
import PropTypes from "prop-types"; // ✅ ใช้ PropTypes เพื่อตรวจสอบข้อมูลสินค้า
import { useNavigate } from "react-router-dom"; // ✅ ใช้ useNavigate สำหรับเปลี่ยนเส้นทางไปยังหน้าการเปรียบเทียบสินค้า

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"; // ✅ กำหนด BASE_URL สำหรับโหลดรูปจากเซิร์ฟเวอร์

export default function ProductCard({ product = {} }) {
  console.log("📸 React ได้รับข้อมูลสินค้า:", product); // ✅ แสดงข้อมูลสินค้าใน Console เพื่อ Debug

  const navigate = useNavigate(); // ✅ ใช้ useNavigate() เพื่อเปลี่ยนเส้นทางเมื่อกดปุ่มเปรียบเทียบ

  // ✅ ตรวจสอบว่าสินค้ามีรูปภาพหรือไม่
  const hasImage = product?.images?.length > 0 && product.images[0]?.fileName;

  return (
    <div 
      className="
        /* ✅ ตั้งค่าตำแหน่งและดีไซน์ของการ์ด */
        relative /* ทำให้สามารถใช้ absolute ตำแหน่งขององค์ประกอบภายใน */
        p-2 /* Padding รอบตัวการ์ด 12px */
        shadow-lg /* เพิ่มเงาให้การ์ดดูมีมิติ */
        rounded-xl /* ทำให้ขอบของการ์ดโค้งมน */
        bg-white /* ตั้งค่าพื้นหลังของการ์ดเป็นสีขาว */
        border border-gray-200 /* เพิ่มเส้นขอบสีเทาอ่อนรอบการ์ด */

        /* ✅ ความกว้าง (Width) ตามขนาดหน้าจอ */
        w-full /* ค่าเริ่มต้น: ใช้ความกว้างเต็มที่ของ Container */
        sm:w-[220px] /* ขนาดหน้าจอ ≥ 640px (มือถือแนวนอน) → กว้าง 280px */
        md:w-[250px] /* ขนาดหน้าจอ ≥ 768px (แท็บเล็ต) → กว้าง 300px */
        lg:w-[290px] /* ขนาดหน้าจอ ≥ 1024px (โน้ตบุ๊ก) → กว้าง 315px */
        xl:w-[320px] /* ขนาดหน้าจอ ≥ 1280px (จอใหญ่) → กว้าง 320px */

        /* ✅ ความสูง (Height) ตามขนาดหน้าจอ */
        h-[500px] /* ค่าเริ่มต้น: สูง 500px */
        sm:h-[280px] /* มือถือแนวนอน ≥ 640px → สูง 520px */
        md:h-[350px] /* แท็บเล็ต ≥ 768px → สูง 540px */
        lg:h-[390px] /* โน้ตบุ๊ก ≥ 1024px → สูง 560px */
        xl:h-[420px] /* จอใหญ่ ≥ 1280px → สูง 580px */

        /* ✅ การจัดเรียงเนื้อหาภายในการ์ด */
        flex flex-col /* ใช้ Flexbox เพื่อจัดเรียงเนื้อหาแนวตั้ง */
        justify-between /* จัดให้เนื้อหาหลัก (รูปภาพ, ข้อมูลสินค้า, ปุ่ม) มีระยะห่างสมดุล */
      "
    >
      {/* ✅ แสดงแบรนด์สินค้า (ถ้ามี) ที่มุมซ้ายบนของการ์ด */}
      <p className="absolute top-3 left-3 text-sm text-gray-500 font-semibold">
        {product.brand || "ไม่ระบุแบรนด์"} {/* ถ้าไม่มีแบรนด์ให้แสดง "ไม่ระบุแบรนด์" */}
      </p>

      {/* ✅ แสดงแท็ก ICT ที่มุมขวาบน ถ้าสินค้าอยู่ในหมวดหมู่ ICT */}
      {product.ict && (
        <div 
        className="absolute top-0 right-0 bg-white border-2 border-gray-300 
        text-green-600 text-lg font-bold px-3 py-1
        rounded-bl-xl shadow-md flex items-center justify-center"
      >
        ICT
      </div>
      )}

      {/* ✅ ส่วนแสดงรูปสินค้า (หากไม่มีรูปจะแสดงข้อความว่า 'ไม่มีรูปสินค้า') */}
      <div className="w-full h-auto min-h-[200px] flex justify-center items-center mt-9">
  {hasImage ? (
    <img
      src={`${BASE_URL}/uploads/products/${product.images[0].fileName}`}
      alt={product.name || "ไม่มีชื่อสินค้า"}
      className="max-w-full max-h-full object-contain"
      onError={(e) => e.target.src = "/placeholder-image.jpg"}
    />
  ) : (
    <p className="text-center text-gray-400 italic">ไม่มีรูปสินค้า</p>
  )}
</div>

      {/* ✅ แสดงชื่อสินค้า โดยตัดข้อความให้แสดงไม่เกิน 2 บรรทัด */}
      <p className="text-sm font-semibold mt-2 text-center line-clamp-2 px-2">
        {product.name || "ไม่มีชื่อสินค้า"}
      </p>

      {/* ✅ แสดงราคาสินค้า โดยใช้สีเขียว (฿ + ค่าราคา) ถ้าไม่มีราคาให้แสดง "ไม่ระบุราคา" */}
      <p className="text-green-600 font-bold text-lg text-center">
        {product.price != null ? `฿${product.price.toLocaleString()}` : "ไม่ระบุราคา"}
      </p>

      {/* ✅ ปุ่มเปรียบเทียบสินค้า กดแล้วไปที่หน้าการเปรียบเทียบสินค้าพร้อมกับชื่อสินค้า */}
      <button
        className="w-full mt-2 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-1"
        onClick={() => navigate(`/compare?product=${encodeURIComponent(product.name || "unknown")}`)}
      >
        <Repeat size={20} /> เปรียบเทียบ
      </button>
    </div>
  );
}

// ✅ กำหนดประเภทของ `props` ที่คาดหวัง เพื่อป้องกันข้อผิดพลาด
ProductCard.propTypes = {
  product: PropTypes.shape({
    brand: PropTypes.string, // ✅ ชื่อแบรนด์ของสินค้า (อาจเป็น `null` ได้)
    name: PropTypes.string, // ✅ ชื่อของสินค้า
    price: PropTypes.number, // ✅ ราคาของสินค้า
    ict: PropTypes.bool, // ✅ ค่าบูลีนเพื่อบอกว่าสินค้าอยู่ในหมวด ICT หรือไม่
    images: PropTypes.arrayOf( // ✅ อาร์เรย์ของรูปภาพสินค้า
      PropTypes.shape({
        fileName: PropTypes.string, // ✅ ชื่อไฟล์รูปภาพสินค้า
      })
    ),
  }),
};
