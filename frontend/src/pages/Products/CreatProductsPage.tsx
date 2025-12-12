// frontend/src/pages/Products/CreatProductsPage.tsx
import { ProductsForm } from "./ProductsForm";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const CreateProductsPage = () => {
  const navigate = useNavigate();

  const handleCreate = async (values: any) => {
    await api.post("/product", values);
    message.success("Product created successfully");
    navigate("/products");
  };

  return (
    <div>
      <h2>Create Product</h2>
      <ProductsForm onSubmit={handleCreate} />
    </div>
  );
};

export default CreateProductsPage;
