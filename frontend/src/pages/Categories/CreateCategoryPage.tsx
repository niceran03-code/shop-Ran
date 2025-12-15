// frontend/src/pages/Categories/CreateCategoryPage.tsx
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { message, Button } from "antd";
import { useNavigate } from "react-router-dom";
import CategoryForm from "./CategoryForm";
import FormContainer from "../../components/Layout/FormContainer";

export default function CreateCategoryPage() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  const submit = async (values: any) => {
    await api.post("/categories", values);
    message.success("Category created");
    navigate("/categories");
  };

  return (
    <div>
      <Button
        style={{ marginBottom: 16 }}
        onClick={() => navigate("/categories")}
      >
        Back to Categories
      </Button>

      <FormContainer title="Create Category" maxWidth={560}>
        <CategoryForm
          categories={categories}
          onSubmit={submit}
          submitText="Create"
        />
      </FormContainer>
    </div>
  );
}
