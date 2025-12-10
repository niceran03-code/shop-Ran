import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { message } from "antd";
import CategoryForm from "./CategoryForm";

export default function CreateCategoryPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  const submit = async (values: any) => {
    try {
      await api.post("/categories", values);
      message.success("Category created");
      history.back();
    } catch {
      message.error("Create failed");
    }
  };

  return (
    <CategoryForm
      categories={categories}
      onSubmit={submit}
      submitText="Create"
    />
  );
}
