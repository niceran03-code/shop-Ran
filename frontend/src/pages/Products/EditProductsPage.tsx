// frontend/src/pages/Products/EditProductsPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, data } from "react-router-dom";
import { Button, message, Spin } from "antd";
import api from "../../utils/axios";
import { ProductsForm } from "./ProductsForm";

const EditProductsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);

  // Fetch product detail
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/product/${id}`);
        setInitialData(res.data);
      } catch {
        message.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleUpdate = async (values: any) => {
    try {
      await api.patch(`/product/${id}`, values);
      message.success("Product updated successfully");
      navigate("/products");
    } catch {
      message.error("Failed to update product");
    }
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <div>
      <Button
        style={{ marginBottom: 16 }}
        onClick={() => navigate("/products")}
      >
        Back to Products
      </Button>
      <h2>Edit Product</h2>

      <ProductsForm initialData={initialData} onSubmit={handleUpdate} />
    </div>
  );
};

export default EditProductsPage;
