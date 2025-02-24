import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../Layouts/AdminLayout";
import Swal from "sweetalert2";

const AddProductPage2 = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";

  const [formData, setFormData] = useState({
    brand: "",
    cscode: "",      //*ประเภทสินค้า
    itemNumber: "",   //* หมายเลขสินค้า
    vendorItemId: "",    //*รหัสสินค้าผู้ขาย 
    itemDescription: "",   //* อธิบาย
    price: "",
    category: "",
    subcategory: "",   //*จัดเซต 
    specICT: false,
    specifications: [{ name: "", description: "" }],
    images: [],
    previewImages: []
  });
  const [resBrands, setResBrands] = useState([]);
  const [resCSCode, setResCSCode] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) navigate("/loginPage");
    const fetchData = async () => {
      try {
        const brandRes = await axios.get("http://localhost:3000/api/brands", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResBrands(brandRes.data.brands);

        const cscodeRes = await axios.get("http://localhost:3000/api/cscodes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResCSCode(cscodeRes.data.CSCodes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setMessage("อัปโหลดได้สูงสุด 5 รูป");
      return;
    }
    setFormData((prevData) => ({ ...prevData, images: files }));
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSpecificationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSpecifications = [...formData.specifications];
    updatedSpecifications[index][name] = value;
    setFormData((prevData) => ({
      ...prevData,
      specifications: updatedSpecifications,
    }));
  };

  const addSpecification = () => {
    setFormData((prevData) => ({
      ...prevData,
      specifications: [...prevData.specifications, { name: "", description: "" }],
    }));
  };

  const removeSpecification = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      specifications: prevData.specifications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((file) => formDataToSend.append("images", file));
      } else if (key === "specifications") {
        formDataToSend.append("specifications", JSON.stringify(value));
      } else {
        formDataToSend.append(key, value);
      }
    });

    try {
      const response = await axios.post("http://localhost:3000/api/newProducts", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => {
        if (res.status === 201) {
          Swal.fire({
            icon: 'success',
            title: 'สำเร็จ',
            text: res.data.message,
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            window.location.reload();
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: res.data.message,
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-center items-center min-h-screen p-8">
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">เพิ่มสินค้า</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* เลือกแบรนด์ */}
            <div>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg text-black"
              >
                <option value="">เลือกแบรนด์</option>
                {resBrands.map((b) => (
                  <option key={b.id} value={b.name} className="text-black">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* เลือก CSCode */}
            <div>
              <select
                name="cscode"
                value={formData.cscode}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg text-black"
              >
                <option value="">เลือก CSCode</option>
                {resCSCode.map((c) => (
                  <option key={c.id} value={c.code} className="text-black">
                    {c.description} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="itemNumber"
                value={formData.itemNumber}
                onChange={handleChange}
                placeholder="หมายเลขสินค้า"
                required
                className="w-full p-3 border rounded-lg text-black"
              />
              <input
                type="text"
                name="name"
                value={formData.vendorItemId}
                onChange={handleChange}
                placeholder="รหัสสินค้าของผู้ขาย"
                className="w-full p-3 border rounded-lg text-black"
              />
            </div>

            {/* รายละเอียดสินค้า */}
            <div>
              <textarea
                name="itemDescription"
                value={formData.itemDescription}
                onChange={handleChange}
                placeholder="คำอธิบายสินค้า"
                className="w-full p-3 border rounded-lg min-h-[100px] text-black"
              ></textarea>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* ราคา */}
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="ราคา"
                required
                className="w-full p-3 border rounded-lg text-black"
              />

              {/* เลือกหมวดหมู่ */}
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg text-black"
              >
                <option value="">เลือกหมวดหมู่ของสินค้า</option>
                <option value="Network" className="text-black">Network</option>
                <option value="IOT" className="text-black">IOT</option>
                <option value="Solar Cell" className="text-black">Solar Cell</option>
              </select>

              {/* เลือกเซ็ตของสินค้า */}
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg text-black"
              >
                <option value="">เลือกเซ็ตของสินค้า</option>
                <option value="Home" className="text-black">Home</option>
                <option value="Factory" className="text-black">Factory</option>
              </select>
            </div>

            {/* Checkbox เปิดใช้งาน ICT */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="specICT"
                checked={formData.specICT}
                onChange={handleChange}
                className="text-black" />
              <span className="ml-2">เปิดใช้งาน Spec. ICT</span>
            </div>

            {/* สเปคของสินค้า */}
            {formData.specifications.map((spec, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  name="name"
                  value={spec.name}
                  onChange={(e) => handleSpecificationChange(index, e)}
                  className="w-75 p-3 border rounded-lg text-black"
                  placeholder="ชื่อสเปค"
                />
                <input
                  type="text"
                  name="description"
                  value={spec.description}
                  onChange={(e) => handleSpecificationChange(index, e)}
                  className="w-full p-3 border rounded-lg text-black"
                  placeholder="รายละเอียดสเปค"
                />
                <button
                  type="button"
                  onClick={() => removeSpecification(index)}
                  className="p-2 bg-red-500 text-white rounded-lg"
                >
                  ลบ
                </button>
              </div>
            ))}
            <button type="button" onClick={addSpecification} className="bg-green-500 text-white px-4 py-2 rounded-lg">เพิ่มสเปค</button>

            {/* อัปโหลดไฟล์ */}
            <div>
              <label className="block font-semibold text-black">อัปโหลดรูปสินค้า (สูงสุด 4 รูป)</label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept="image/*"
                className="w-full p-3 border rounded-lg text-black"
              />
              <div className="grid grid-cols-4 gap-2 mt-3">
                {previewImages.map((img, index) => (
                  <img key={index} src={img} alt="preview" className="w-full h-24 object-cover border rounded-lg" />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg px-5 py-2.5 text-center me-2 mb-2"
            >เพิ่มสินค้า
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddProductPage2;