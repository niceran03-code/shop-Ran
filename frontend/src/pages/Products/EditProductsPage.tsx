// frontend/src/pages/Products/EditProductsPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, message, Spin } from "antd";
import api from "../../utils/axios";
import { ProductsForm } from "./ProductsForm";
import FormContainer from "../../components/Layout/FormContainer";

const EditProductsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);

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

    if (id) fetchProduct();
  }, [id]);

  const handleUpdate = async (values: any) => {
    await api.patch(`/product/${id}`, values);
    message.success("Product updated successfully");
    navigate("/products");
  };

  if (loading) return <Spin />;

  return (
    <div>
      <Button
        style={{ marginBottom: 16 }}
        onClick={() => navigate("/products")}
      >
        Back to Products
      </Button>

      <FormContainer title="Edit Product">
        <ProductsForm initialData={initialData} onSubmit={handleUpdate} />
      </FormContainer>
    </div>
  );
};

export default EditProductsPage;
