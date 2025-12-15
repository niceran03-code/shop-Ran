// frontend/src/pages/Auth/LoginForm.tsx
import { Form, Input, Button, message } from "antd";
import api from "../../utils/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", values);
      const { accessToken, refreshToken, user } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", String(user.id));
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("username", user.username);

      message.success("Login successful!");
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={handleLogin} layout="vertical">
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Please enter email" }]}
      >
        <Input placeholder="email@example.com" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please enter password" }]}
      >
        <Input.Password placeholder="Password" />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading} block>
        Login
      </Button>

      <Button type="link" block onClick={onSwitch}>
        No account? Register
      </Button>
    </Form>
  );
}
