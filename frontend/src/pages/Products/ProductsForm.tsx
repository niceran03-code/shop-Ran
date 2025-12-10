import { useEffect } from "react";
import { Form, Input, InputNumber, Button, message, Select } from "antd";
import axios from "axios";

interface ProductFormProps {
  initialData?: any; // 编辑模式的数据
  onSubmit: (values: any) => Promise<void>;
}

export const ProductsForm = ({ initialData, onSubmit }: ProductFormProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    }
  }, [initialData]);

  const handleFinish = async (values: any) => {
    try {
      await onSubmit(values);
      message.success("Saved successfully!");
    } catch (err) {
      message.error("Failed to save");
    }
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
        <InputNumber
          min={0}
          style={{ width: "100%" }}
          placeholder="Enter price"
        />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input.TextArea rows={3} placeholder="Product description" />
      </Form.Item>

      <Form.Item
        label="Status"
        name="isActive"
        initialValue={true}
        rules={[{ required: true }]}
      >
        <Select
          options={[
            { value: true, label: "Active" },
            { value: false, label: "Inactive" },
          ]}
        />
      </Form.Item>

      <Button type="primary" htmlType="submit" block>
        Save
      </Button>
    </Form>
  );
};
