import AdminLayout from "../Layouts/AdminLayout";
import { useState, useEffect } from "react";

export default function AddProductForm() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [product, setProduct] = useState({
    name: "",
    sku: "",
    category: "",
    brand: "",
    description: "",
    ictStandard: false,
    images: [],
    specs: [""],
    price: "",
    status: "มีสินค้า",
  });

  // ✅ โหลดข้อมูลจาก API (Categories & Brands)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const categoriesRes = await fetch("http://localhost:3000/api/categories");
        const categoriesData = await categoriesRes.json();
        console.log("🔹 Categories from API:", categoriesData);
        setCategories(Array.isArray(categoriesData.categories) ? categoriesData.categories : []);

        const brandsRes = await fetch("http://localhost:3000/api/brands");
        const brandsData = await brandsRes.json();
        console.log("🔹 Brands from API:", brandsData);
        setBrands(Array.isArray(brandsData.brands) ? brandsData.brands : []);

      } catch (error) {
        console.error("❌ Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log("🔍 Categories state after update:", categories);
  console.log("🔍 Brands state after update:", brands);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(`🛠 Updating state: ${name} = ${value}`); // Debug
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSpecChange = (index, value) => {
    const newSpecs = [...product.specs];
    newSpecs[index] = value;
    setProduct((prev) => ({ ...prev, specs: newSpecs }));
  };

  const addSpecField = () => {
    setProduct((prev) => ({ ...prev, specs: [...prev.specs, ""] }));
  };

  const removeSpecField = (index) => {
    const newSpecs = [...product.specs];
    newSpecs.splice(index, 1);
    setProduct((prev) => ({ ...prev, specs: newSpecs }));
  };

  const [images, setImages] = useState([null, null, null, null]);

  const handleImageChange = (event, index) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[index] = objectUrl;
      return newImages;
    });

    setProduct((prev) => ({
      ...prev,
      images: [...prev.images, file],
    }));
  };

  const handleClearImages = () => {
    setImages([null, null, null, null]);
    setProduct((prev) => ({ ...prev, images: [] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!product.name || !product.sku || !product.itemNumber || !product.category || !product.brand || !product.price || !product.description) {
      alert("❌ กรุณากรอกข้อมูลสินค้าครบถ้วน");
      return;
    }
  
    console.log("🔍 Category ที่ส่งไป API:", product.category); // ✅ Debug ก่อนส่ง
  
    const formData = new FormData();
  
    formData.append("brand", String(product.brand));
    formData.append("cscode", String(product.sku));
    formData.append("itemNumber", String(product.itemNumber));
    formData.append("itemDescription", String(product.description));
    formData.append("category", String(product.category)); // ✅ ให้แน่ใจว่าค่านี้ถูกต้อง
    formData.append("price", Number(product.price));
    formData.append("specICT", product.ictStandard ? "true" : "false");
  
    if (product.specs.length > 0) {
      const formattedSpecs = product.specs.map((spec) => ({
        name: spec,
        description: "",
      }));
      formData.append("specifications", JSON.stringify(formattedSpecs));
    }
  
    if (product.images.length > 0) {
      product.images.forEach((file) => {
        if (file instanceof File) {
          formData.append("images", file);
        }
      });
    }
  
    console.log("🔍 ข้อมูลที่ส่งไป API:", Object.fromEntries(formData.entries()));
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้า");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/api/newProducts", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      console.log("🔍 API Response:", data);
  
      if (!response.ok) {
        console.error("❌ API Error:", data);
        alert(`❌ เกิดข้อผิดพลาดจากเซิร์ฟเวอร์: ${data.message || JSON.stringify(data)}`);
      } else {
        alert("✅ เพิ่มสินค้าสำเร็จ!");
      }
  
    } catch (error) {
      console.error("❌ Error:", error);
      alert("❌ เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
  };
  

  return (
    <AdminLayout>
         <form onSubmit={handleSubmit} className="max-w-full mx-auto p-6 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">ข้อมูลสินค้า</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* 🔥 1. ชื่อสินค้า */}
        <div>
          <label className="font-semibold block mb-2">ชื่อสินค้า :</label>
          <input type="text" name="name" value={product.name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" />
        </div>

        {/* 🔥 2. หมายเลขสินค้า */}
        <div>
            <label className="font-semibold block mb-2">หมายเลขสินค้า :</label>
            <input type="text" name="sku" value={product.sku} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" />
          </div>

        {/* 🔥 3. ประเภทสินค้า */}
        <div>
          <label className="font-semibold block mb-2">ประเภทสินค้า :</label>
          <select name="category" value={product.category} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg">
  <option value="">เลือกประเภทสินค้า</option>
  <option value="Network">Network</option>
  <option value="IOT">IOT</option>
  <option value="Solar Cell">Solar Cell</option>
</select>
        </div>

        {/* 🔥 4. แบรนด์สินค้า */}
        <div>
          <label className="font-semibold block mb-2">แบรนด์สินค้า :</label>
          <select name="brand" value={product.brand} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg">
  {isLoading ? <option>กำลังโหลด...</option> : 
    brands.length > 0 ? 
      brands.map((brand) => <option key={brand._id} value={brand.name}>{brand.name}</option>) 
      : <option>❌ ไม่มีข้อมูลแบรนด์</option>}
</select>
        </div>

        {/* 🔥 5. รายละเอียดสินค้า */}
        <div className="col-span-2">
          <label className="font-semibold block mb-2">รายละเอียดสินค้า :</label>
          <textarea name="description" value={product.description} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg"></textarea>
        </div>

        {/* 🔹 หมายเลขสินค้า (itemNumber) */}
        <div>
            <label className="font-semibold block mb-2">จำนวนสินค้า(Item Number) :</label>
            <input type="text" name="itemNumber" value={product.itemNumber} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" />
          </div>

        {/* 🔥 6. มาตรฐาน ICT */}
        <div className="col-span-2 flex items-center gap-3">
          <input type="checkbox" name="ictStandard" checked={product.ictStandard} onChange={handleChange} className="w-6 h-6 border-2 border-gray-400 rounded-md" />
          <label className="font-semibold text-lg cursor-pointer">เป็น SPEC ICT</label>
        </div>
      </div>

           {/* 🔥 7. อัปโหลดรูปภาพ */}
      <h3 className="text-xl font-bold mt-6">รูปสินค้า</h3>
      <div className="flex flex-col items-center gap-6 p-1 py-5 bg-gray-100 rounded-2xl">
        {/* รูปใหญ่ตรงกลาง */}
        <div className="flex justify-center">
          <label className="w-48 h-48 border-2 border-dashed bg-white border-blue-400 flex items-center justify-center cursor-pointer rounded-lg overflow-hidden">
            {images[0] ? (
              <img src={images[0]} alt="Uploaded" className="w-full h-full object-cover" />
            ) : (
              <span className="text-9xl text-blue-500">+</span>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 0)} />
          </label>
        </div>

        {/* 3 รูปเล็กด้านล่าง */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 w-full max-w-md justify-center">
          {[1, 2, 3].map((index) => (
            <label key={index} className="border-2 border-dashed bg-white border-blue-400 flex items-center justify-center cursor-pointer rounded-lg overflow-hidden w-32 h-32 sm:w-28 sm:h-28">
              {images[index] ? (
                <img src={images[index]} alt="Uploaded" className="w-full h-full object-cover" />
              ) : (
                <span className="text-7xl text-blue-500">+</span>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, index)} />
            </label>
          ))}
        </div>

        {/* ปุ่มล้างรูป */}
        <div className="w-full flex justify-end">
          <button onClick={handleClearImages} className="bg-red-500 text-white rounded hover:bg-red-600 transition-all px-5 py-3">
            ล้างรูปที่อัปโหลด
          </button>
        </div>
      </div>

          {/* 🔥 8. สเปคสินค้า */}
      <div className="col-span-2">
        <h3 className="text-xl font-bold mt-6">สเปคสินค้า</h3>
        {product.specs.map((spec, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input type="text" value={spec} onChange={(e) => handleSpecChange(index, e.target.value)} placeholder="ระบุรายละเอียดสเปคสินค้า" className="w-full p-3 border border-gray-300 rounded-lg" />
            {index === product.specs.length - 1 && <button onClick={addSpecField} className="px-4 py-2 bg-blue-500 text-white rounded-lg">+</button>}
            {product.specs.length > 1 && <button onClick={() => removeSpecField(index)} className="px-4 py-2 bg-red-500 text-white rounded-lg">-</button>}
          </div>
        ))}
      </div>

      {/* 🔥 9. ราคาสินค้า */}
      <div>
        <label className="font-semibold block mb-2">ราคาสินค้า :</label>
        <input type="number" name="price" value={product.price} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" />
      </div>

    

      {/* 🔥 ปุ่มบันทึก */}
      <div className="flex justify-end mt-6 gap-4">
        <button type="reset" className="px-4 py-2 bg-gray-300 rounded">ยกเลิก</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">บันทึก</button>
      </div>
    </form>
    </AdminLayout>
  );
}
