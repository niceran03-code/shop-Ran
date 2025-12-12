// frontend/src/pages/Products/CreatProductsPage.tsx
import { ProductsForm } from "./ProductsForm";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { message, Button } from "antd";

const CreateProductsPage = () => {
  const navigate = useNavigate();

  const handleCreate = async (values: any) => {
    await api.post("/product", values);
    message.success("Product created successfully");
    navigate("/products");
  };

  return (
    <div>
      <Button
        style={{ marginBottom: 16 }}
        onClick={() => navigate("/products")}
      >
        Back to Products
      </Button>

      <h2>Create Product</h2>

      <ProductsForm onSubmit={handleCreate} />
    </div>
  );
};

export default CreateProductsPage;
