import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import DeleteProductButton from "../Components/DeleteProductButton";
import EditProductButton from "../Components/EditProductButton";

export default function LatestProductsTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/api/newProducts?page=${page}&limit=${limit}`)
      .then((response) => {
        const sortedProducts = (response.data.products || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setProducts(sortedProducts);
        setTotalPages(Math.ceil(response.data.count / limit));
      })
      .catch(() => setError("โหลดข้อมูลล้มเหลว"))
      .finally(() => setLoading(false));
  }, [page]);

  const handleDelete = (deletedId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product._id !== deletedId)
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">สินค้าล่าสุด</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="ค้นหา..."
              className="pl-10 pr-4 py-2 border rounded-md focus:ring focus:ring-blue-200 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-100">
            <Filter size={18} /> กรอง
          </button>
        </div>
      </div>

      {/* Loading / Error */}
      {loading ? (
        <p className="text-gray-500">กำลังโหลด...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">ไม่มีสินค้าล่าสุด</p>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-blue-600 text-white">
                <tr className="text-sm">
                  <th className="p-4 text-left">#</th>
                  <th className="p-4 text-left">รูป</th>
                  <th className="p-4 text-left">แบรนด์</th>
                  <th className="p-4 text-left">ชื่อสินค้า</th>
                  <th className="p-4 text-left">หมวดหมู่</th>
                  <th className="p-4 text-left">specICT</th>
                  <th className="p-4 text-left">ราคา</th>
                  <th className="p-4 text-center">แก้ไข</th>
                  <th className="p-4 text-center">ลบ</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter((product) =>
                    product.itemDescription
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((product, index) => (
                    <tr key={product._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{(page - 1) * limit + index + 1}</td>
                      <td className="p-4">
                        {product.images?.length > 0 ? (
                          <img
                            src={`http://localhost:3000/uploads/products/${product.images[0].fileName}`}
                            alt={product.itemDescription}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        ) : (
                          <span className="text-gray-400">ไม่มีรูป</span>
                        )}
                      </td>
                      <td className="p-4">{product.brand || "-"}</td>
                      <td className="p-4">
                        <span
                          className="truncate max-w-[200px] inline-block"
                          title={product.itemDescription}
                        >
                          {product.itemDescription.length > 20
                            ? `${product.itemDescription.substring(0, 20)}...`
                            : product.itemDescription}
                        </span>
                      </td>
                      <td className="p-4">{product.category || "-"}</td>
                      <td className="p-4">
                        {product.specICT ? (
                          <span className="text-green-600">✔</span>
                        ) : (
                          <span className="text-red-600">✘</span>
                        )}
                      </td>
                      <td className="p-4">
                        {product.price ? `${product.price} บาท` : "-"}
                      </td>
                      <td className="p-4 text-center">
                        <EditProductButton productId={product._id} />
                      </td>
                      <td className="p-4 text-center">
                        <DeleteProductButton
                          productId={product._id}
                          onDelete={handleDelete}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft size={18} /> ก่อนหน้า
            </button>
            <span className="text-gray-700">
              หน้าที่ {page} / {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              ถัดไป <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
