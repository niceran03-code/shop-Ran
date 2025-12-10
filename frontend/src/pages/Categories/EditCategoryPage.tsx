import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/axios";
import { message } from "antd";
import CategoryForm from "./CategoryForm";

export default function EditCategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get(`/categories/${id}`).then((res) => setCategory(res.data));
    api.get("/categories").then((res) => setCategories(res.data));
  }, [id]);

  const submit = async (values: any) => {
    try {
      await api.patch(`/categories/${id}`, values);
      message.success("Category updated");
      history.back();
    } catch {
      message.error("Update failed");
    }
  };

  if (!category) return null;

  return (
    <CategoryForm
      initialValues={category}
      categories={categories}
      onSubmit={submit}
      submitText="Update"
    />
  );
}
