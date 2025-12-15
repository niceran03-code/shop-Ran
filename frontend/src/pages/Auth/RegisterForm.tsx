// frontend/src/pages/Auth/RegisterForm.tsx
import { Form, Input, Button, message } from "antd";
import api from "../../utils/axios";

export default function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      const { confirmPassword, ...payload } = values;
      await api.post("/auth/register", payload);
      message.success("Register success, please login");
      onSwitch();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Register failed");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please input your email" },
          { type: "email", message: "Invalid email format" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Username" name="username" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, min: 6 }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Confirm Password"
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
          { required: true },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Passwords do not match"));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Button type="primary" htmlType="submit" block>
        Register
      </Button>

      <Button type="link" block onClick={onSwitch}>
        Already have an account? Login
      </Button>
    </Form>
  );
}
