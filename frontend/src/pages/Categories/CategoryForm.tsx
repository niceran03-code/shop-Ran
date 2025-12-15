import { Form, Input, Button, Select } from "antd";

import React from "react";

interface Category {
  id: number | string;
  name: string;
}

interface CategoryFormProps {
  initialValues?: { [key: string]: any };
  categories: Category[];
  onSubmit: (values: any) => void;
  submitText?: string;
}

export default function CategoryForm({
  initialValues,
  categories,
  onSubmit,
  submitText = "Save",
}: CategoryFormProps) {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      <Form.Item
        label="Category Name"
        name="name"
        rules={[{ required: true, message: "Please enter category name" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Parent Category" name="parentId">
        <Select allowClear placeholder="None">
          {categories.map((c) => (
            <Select.Option key={c.id} value={c.id}>
              {c.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Button type="primary" htmlType="submit">
        {submitText}
      </Button>
    </Form>
  );
}
