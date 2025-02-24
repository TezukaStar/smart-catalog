import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

export default function EditProductButton({ productId }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit-product/${productId}`);  // ✅ นำทางไปหน้าแก้ไขสินค้าที่ถูกต้อง
  };

  return (
    <button
      onClick={handleEdit}
      className="text-blue-500 hover:text-blue-700"
      title="แก้ไขสินค้า"
    >
      <Pencil size={18} />
    </button>
  );
}
