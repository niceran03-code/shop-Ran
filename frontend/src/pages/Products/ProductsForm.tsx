// frontend/src/pages/Products/ProductsForm.tsx
import { useEffect, useState } from "react";
import { Form, Input, InputNumber, Button, message, Select } from "antd";
import api from "../../utils/axios";
import { Switch } from "antd";

interface Category {
  id: number;
  name: string;
}

interface ProductFormProps {
  initialData?: any;
  onSubmit: (values: any) => Promise<void>;
}

export const ProductsForm = ({ initialData, onSubmit }: ProductFormProps) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Load category dropdown data
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await api.get("/categories/simple");
        setCategories(res.data);
      } catch {
        message.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fill form in edit mode
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    }
  }, [initialData, form]);

  const handleFinish = async (values: any) => {
    await onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      style={{ maxWidth: 500 }}
    >
      <Form.Item
        label="Product Name"
        name="name"
        rules={[{ required: true, message: "Please enter product name" }]}
      >
        <Input placeholder="Product name" />
      </Form.Item>

      <Form.Item
        label="Price"
        name="price"
        rules={[{ required: true, message: "Please enter price" }]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Stock"
        name="stock"
        rules={[{ required: true, message: "Please enter stock quantity" }]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input.TextArea rows={4} placeholder="Product description" />
      </Form.Item>

      <Form.Item
        label="Category"
        name="categoryId"
        rules={[{ required: true, message: "Please select a category" }]}
      >
        <Select
          loading={loadingCategories}
          placeholder="Select category"
          options={categories.map((c) => ({
            label: c.name,
            value: c.id,
          }))}
        />
      </Form.Item>

      <Form.Item
        label="Status"
        name="isActive"
        valuePropName="checked"
        initialValue={true}
      >
        <Switch />
      </Form.Item>

      <Button type="primary" htmlType="submit" block>
        Save
      </Button>
    </Form>
  );
};
