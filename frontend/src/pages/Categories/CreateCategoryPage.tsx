// frontend/src/pages/Categories/CreateCategoryPage.tsx
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { message, Button } from "antd";
import { useNavigate } from "react-router-dom";
import CategoryForm from "./CategoryForm";

export default function CreateCategoryPage() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  const submit = async (values: any) => {
    try {
      await api.post("/categories", values);
      message.success("Category created");
      navigate("/categories");
    } catch {
      message.error("Create failed");
    }
  };

  return (
    <div>
      <Button
        style={{ marginBottom: 16 }}
        onClick={() => navigate("/categories")}
      >
        Back to Categories
      </Button>

      <CategoryForm
        categories={categories}
        onSubmit={submit}
        submitText="Create"
      />
    </div>
  );
}
