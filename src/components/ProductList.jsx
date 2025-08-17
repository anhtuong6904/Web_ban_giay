import { useEffect, useState } from "react";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Server error: " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setError("API did not return an array");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  const formatPrice = (price) => price.toLocaleString("vi-VN") + "₫";

  return (
    <ul>
      {products.map((p, index) => (
        <li key={p.ProductID || index}>
          {p.Name} - {formatPrice(p.Price)}
        </li>
      ))}
    </ul>
  );
}

export default ProductList;
