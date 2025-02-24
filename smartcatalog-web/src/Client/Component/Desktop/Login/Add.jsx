import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProductPage = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token") || "";
  const [brandName, setBrand] = useState("");
  const [brands, setBrands] = useState([]);
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [ict, setIct] = useState(false);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [features, setFeatures] = useState([{ name: "", description: "" }]);
  const [cscode, setCsCode] = useState("");
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/loginPage");
    }
    const fetchData = async () => {
      try {
        const brandResponse = await axios.get("http://localhost:3000/api/brands", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBrands(brandResponse.data.brands);

        const categoryResponse = await axios.get("http://localhost:3000/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(categoryResponse.data.categories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await axios.post(
        "http://localhost:3000/api/products",
        { brandName, productId, name, ict, description, price, features, cscode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201) {
        setMessage("เพิ่มสินค้าสำเร็จ!");
        setBrand("");
        setProductId("");
        setName("");
        setIct(false);
        setDescription("");
        setPrice("");
        setFeatures([{ name: "", description: "" }]);
        setCsCode("");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มสินค้า");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">เพิ่มสินค้า</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select value={brandName} onChange={(e) => setBrand(e.target.value)} required>
            <option value="">เลือกแบรนด์</option>
            {brands.map((b) => (
              <option key={b.id} value={b.name}>{b.name}</option>
            ))}
          </select>
          <input type="text" value={productId} onChange={(e) => setProductId(e.target.value)} placeholder="รหัสสินค้า" required />
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="ชื่อสินค้า" required />
          <div className="grid grid-cols-3 gap-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="w-24 h-24 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer">
                +
              </div>
            ))}
          </div>
          <div>
            <label className="flex items-center">
              <input type="checkbox" checked={ict} onChange={(e) => setIct(e.target.checked)} />
              <span className="ml-2">เปิดใช้งาน ICT</span>
            </label>
          </div>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="ราคา" required />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="รายละเอียดสินค้า"></textarea>
          {features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <input type="text" value={feature.name} onChange={(e) => {
                const newFeatures = [...features];
                newFeatures[index].name = e.target.value;
                setFeatures(newFeatures);
              }} placeholder="ชื่อคุณสมบัติ" />
              <input type="text" value={feature.description} onChange={(e) => {
                const newFeatures = [...features];
                newFeatures[index].description = e.target.value;
                setFeatures(newFeatures);
              }} placeholder="รายละเอียด" />
              <button type="button" onClick={() => setFeatures(features.filter((_, i) => i !== index))}>ลบ</button>
            </div>
          ))}
          <button type="button" onClick={() => setFeatures([...features, { name: "", description: "" }])}>+ เพิ่มคุณสมบัติ</button>
          <select value={cscode} onChange={(e) => setCsCode(e.target.value)} required>
            <option value="">เลือกหมวดหมู่</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.code}>{cat.name}</option>
            ))}
          </select>
          {message && <p>{message}</p>}
          <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-lg">เพิ่มสินค้า</button>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
