 import { useEffect, useState } from "react";

function ProductList() {
  const [products, setProducts] = useState([]);
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
        console.log("Products fetched:", data);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div style={{color: "red"}}>Error: {error}</div>;

  return (
    <ul>
      {products.map(p => (
        <li key={p.ProductID}>{p.Name} - {p.Price}</li>

        
      ))}
    </ul>
  );
}

export default ProductList;
