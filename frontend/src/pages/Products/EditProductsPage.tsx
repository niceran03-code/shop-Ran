import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductsForm } from "./ProductsForm";
import { message } from "antd";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);

  const loadProduct = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.get(`http://localhost:3000/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProduct(res.data);
    } catch (err) {
      message.error("Failed to load product");
    }
  };

  useEffect(() => {
    loadProduct();
  }, []);

  const updateProduct = async (values: any) => {
    const token = localStorage.getItem("accessToken");

    await axios.patch(`http://localhost:3000/product/${id}`, values, {
      headers: { Authorization: `Bearer ${token}` },
    });

    navigate("/products");
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Product</h2>
      <ProductsForm initialData={product} onSubmit={updateProduct} />
    </div>
  );
}
