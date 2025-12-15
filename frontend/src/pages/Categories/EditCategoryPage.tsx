// frontend/src/pages/Categories/EditCategoryPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import { message, Button } from "antd";
import CategoryForm from "./CategoryForm";
import FormContainer from "../../components/Layout/FormContainer";

export default function EditCategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get(`/categories/${id}`).then((res) => setCategory(res.data));
    api.get("/categories").then((res) => setCategories(res.data));
  }, [id]);

  const submit = async (values: any) => {
    await api.patch(`/categories/${id}`, values);
    message.success("Category updated");
    navigate("/categories");
  };

  if (!category) return null;

  return (
    <div>
      {/* Back Button */}
      <Button
        style={{ marginBottom: 16 }}
        onClick={() => navigate("/categories")}
      >
        Back to Categories
      </Button>

      <FormContainer title="Edit Category" maxWidth={560}>
        <CategoryForm
          initialValues={category}
          categories={categories}
          onSubmit={submit}
          submitText="Update"
        />
      </FormContainer>
    </div>
  );
}
