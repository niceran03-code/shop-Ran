// frontend/src/pages/Products/CreatProductsPage.tsx
import { ProductsForm } from "./ProductsForm";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { message, Button } from "antd";
import FormContainer from "../../components/Layout/FormContainer";

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

      <FormContainer title="Create Product">
        <ProductsForm onSubmit={handleCreate} />
      </FormContainer>
    </div>
  );
};

export default CreateProductsPage;
