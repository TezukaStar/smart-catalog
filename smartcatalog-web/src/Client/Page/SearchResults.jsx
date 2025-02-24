import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
      fetch(`/api/products/search?name=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => setResults(data.products || []))
        .catch((error) => console.error("Error:", error));
    }
  }, [query]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">
        ผลลัพธ์การค้นหา: {query ? `"${query}"` : "กรุณาป้อนคำค้นหา"}
      </h1>
      {results.length > 0 ? (
        <ul>
          {results.map((product) => (
            <li key={product._id} className="border-b p-2">
              <Link
                to={`/product/${product._id}`}
                className="text-blue-500 hover:underline"
              >
                {product.name}
              </Link>
              <p>แบรนด์: {product.brand}</p>
              <p>ราคา: {product.price} บาท</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>ไม่พบสินค้าตามคำค้นหา</p>
      )}
    </div>
  );
};

export default SearchResults;
