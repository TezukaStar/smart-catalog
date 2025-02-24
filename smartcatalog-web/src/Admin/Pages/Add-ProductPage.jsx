import LogoADD from "../../assets/Image/addProduct.png";
import { useState } from "react";
import AdminLayout from "../Layouts/AdminLayout";
import Type from "../Components/Type"


export default function AddProductForm() {
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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

  {/* ส่วนอัพโหลดรูป*/}
  const [images, setImages] = useState([null, null, null, null]);

  const handleImageChange = async (event, index) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
      return;
    }

    // สร้าง Object URL
    const objectUrl = URL.createObjectURL(file);
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[index] = objectUrl;
      return newImages;
    });
  };

  const handleClearImages = () => {
    setImages([null, null, null, null]);
  };

  {/* ลบรายการสเปคสินค้า*/}
  // const [productType, setProductType] = useState("สินค้า");

  {/* ลบรายการสเปคสินค้า*/}
  const removeSpecField = (index) => {
    const newSpecs = [...product.specs];
    newSpecs.splice(index, 1); // ลบ 1 รายการตาม index ที่เลือก
    setProduct({ ...product, specs: newSpecs }); // อัปเดต state
  };

  return (
      <AdminLayout>
       <div className="w-full max-w-full mx-auto rounded-t-2xl shadow-2xl bg-white overflow-hidden">
        <Type/>
                    {/* ส่วนหัว */}
                    {/* <div className="w-full bg-[#007bff] text-white p-5 flex items-center gap-4 justify-start">
                      <img
                        src={LogoADD}
                        alt="เพิ่มข้อมูลสินค้า"
                        className="h-12 w-auto object-cover cursor-pointer"
                      />
                      <h2 className="text-2xl sm:text-3xl font-bold">เพิ่มข้อมูลสินค้า</h2>
                    </div>
           */}
                    {/* ส่วนเลือกประเภทสินค้า */}
                    {/* <div className="bg-gray-100 p-6 shadow-md w-full">
                      <h3 className="font-semibold text-black mb-4 text-xl sm:text-2xl">ประเภทสินค้า</h3>
                      <div className="flex flex-col sm:flex-row gap-4 w-full">
                        {["สินค้า", "โปรโมชั่นแพ็กเกจ"].map((type) => (
                          <button
                            key={type}
                            onClick={() => setProductType(type)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg border transition-all w-full text-center justify-center shadow-md text-lg sm:text-xl ${
                              productType === type ? "bg-white text-blue-600 font-bold border-blue-600" : "bg-gray-200 text-gray-700 border-gray-300"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 flex items-center justify-center border rounded-full ${
                                productType === type ? "bg-blue-600 border-blue-600" : "border-gray-500 bg-gray-500"
                              }`}
                            >
                              <div className={`${productType === type ? "w-2.5 h-2.5 bg-white rounded-full" : "w-2.5 h-2.5 bg-white rounded-full"}`}></div>
                            </div>
                            {type}
                          </button>
                        ))}
                      </div>
                    </div> */}
  
           {/* form*/}
        <div className="max-w-full mx-auto p-6 bg-white rounded shadow-lg ">
          <h2 className="text-2xl font-bold mb-4">ข้อมูลสินค้า</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* ชื่อสินค้า */}
            <div>
              <label className="font-semibold block mb-2">ชื่อสินค้า :</label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="ระบุชื่อสินค้า"
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            {/* หมายเลขสินค้า */}
            <div>
              <label className="font-semibold block mb-2">
                หมายเลขสินค้า :
              </label>
              <input
                type="text"
                name="sku"
                value={product.sku}
                onChange={handleChange}
                placeholder="ระบุหมายเลขสินค้า"
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            {/* ประเภทสินค้า */}
            <div>
              <label className="font-semibold block mb-2">ประเภทสินค้า :</label>
              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="">เลือกประเภทสินค้า</option>
                <option value="electronics">อิเล็กทรอนิกส์</option>
                <option value="fashion">แฟชั่น</option>
              </select>
            </div>

            {/* แบรนด์สินค้า */}
            <div>
              <label className="font-semibold block mb-2">แบรนด์สินค้า :</label>
              <select
                name="brand"
                value={product.brand}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="">เลือกแบรนด์</option>
                <option value="brand1">แบรนด์ 1</option>
                <option value="brand2">แบรนด์ 2</option>
              </select>
            </div>

            {/* รายละเอียดสินค้า */}
            <div className="col-span-2">
              <label className="font-semibold block mb-2">
                รายละเอียดสินค้า :
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="ระบุรายละเอียดสินค้า"
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
              ></textarea>
            </div>

            {/* มาตราฐาน ICT */}
            <div className="col-span-2 flex items-center gap-3">
              <input
                type="checkbox"
                name="ictStandard"
                checked={product.ictStandard}
                onChange={handleChange}
                className="w-6 h-6 border-2 border-gray-400 rounded-md"
              />
              <label className="font-semibold text-lg cursor-pointer">
                เป็น SPEC ICT
              </label>
            </div>
          </div>

          <h3 className="text-xl font-bold mt-6">รูปสินค้า</h3>
          <div className="flex flex-col items-center gap-6 p-1 py-5 bg-gray-100 rounded-2xl">
            {/* รูปใหญ่ตรงกลาง */}
            <div className="flex justify-center">
              <label className="w-48 h-48 border-2 border-dashed bg-white border-blue-400 flex items-center justify-center cursor-pointer rounded-lg overflow-hidden">
                {images[0] ? (
                  <img
                    src={images[0]}
                    alt="Uploaded"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-9xl text-blue-500">+</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, 0)}
                />
              </label>
            </div>

            {/* 3 รูปด้านล่าง อยู่ตรงกลาง */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 w-full max-w-md justify-center">
              {[1, 2, 3].map((index) => (
                <label
                  key={index}
                  className=" border-2 border-dashed bg-white border-blue-400 flex items-center justify-center cursor-pointer rounded-lg overflow-hidden 
                  w-32 h-32 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-38 lg:h-40"
                >
                  {images[index] ? (
                    <img
                      src={images[index]}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-7xl text-blue-500">+</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, index)}
                  />
                </label>
              ))}
            </div>

            <div className="w-full flex justify-end">
              <button
                onClick={handleClearImages}
                className="bg-red-500 text-white rounded hover:bg-red-600 transition-all
    px-5 py-3 lg:px-4 lg:py-2 md:px-3 md:py-1 sm:px-1 sm:py-1
    text-lg lg:text-base md:text-sm sm:text-xs"
              >
                ล้างรูปที่อัปโหลด
              </button>
            </div>
          </div>

          {/* สเปคสินค้า */}
          <div className="col-span-2">
            <h3 className="text-xl font-bold mt-6">สเปคสินค้า</h3>
            {product.specs.map((spec, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={spec}
                  onChange={(e) => handleSpecChange(index, e.target.value)}
                  placeholder="ระบุรายละเอียดสเปคสินค้า"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                {/* ปุ่มเพิ่ม (+) */}
                {index === product.specs.length - 1 && (
                  <button
                    onClick={addSpecField}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    +
                  </button>
                )}
                {/* ปุ่มลบ (-) แสดงทุกแถว แต่ต้องมีอย่างน้อย 1 รายการ */}
                {product.specs.length > 1 && (
                  <button
                    onClick={() => removeSpecField(index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  >
                    -
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* ราคาสินค้า */}
          <div className="col-span-2 sm:col-span-1">
            <label className="font-semibold block mb-2">ราคาสินค้า :</label>
            <div className="relative max-w-xs">
              {" "}
              {/* ปรับขนาดให้ไม่กว้างเกิน */}
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="ระบุราคา"
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition pr-12"
              />
              <span className="absolute right-3 top-3 text-gray-500">บาท</span>
            </div>
          </div>

          <h3 className="text-xl font-bold mt-6">สถานะสินค้า</h3>
          <div className="flex flex-wrap gap-4">
            {[
              {
                label: "มีสินค้า",
                color: "text-green-600 bg-green-100 border-green-400",
              },
              {
                label: "สินค้าหมด",
                color: "text-red-600 bg-red-100 border-red-400",
              },
              {
                label: "สินค้าใหม่",
                color: "text-yellow-600 bg-yellow-100 border-yellow-400",
              },
              {
                label: "โปรโมชั่น",
                color: "text-blue-600 bg-blue-100 border-blue-400",
              },
            ].map(({ label, color }) => (
              <label
                key={label}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border ${color} cursor-pointer`}
              >
                <input
                  type="radio"
                  name="status"
                  value={label}
                  checked={product.status === label}
                  onChange={handleChange}
                  className="hidden"
                />
                <div className="w-4 h-4 border-2 border-gray-400 rounded-full flex items-center justify-center">
                  {product.status === label && (
                    <div className="w-2 h-2 bg-blue-600   rounded-full"></div>
                  )}
                </div>
                <span className="font-semibold">{label}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-end mt-6 gap-4">
            <button className="px-4 py-2 bg-gray-300 rounded">ยกเลิก</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              บันทึก
            </button>
          </div>
        </div>
        </div>
      </AdminLayout>
    );
  }
  
