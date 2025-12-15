// frontend/src/pages/Login/LoginPage.tsx
import { useEffect, useState } from "react";
import { Card, Form, Input, Button, message } from "antd";
import api from "../../utils/axios";
import styles from "./LoginPage.module.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // 接收注册页传来的 email，自动填充邮箱
  useEffect(() => {
    if (location.state?.email) {
      form.setFieldsValue({
        email: location.state.email,
      });
    }
  }, [location.state, form]);

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", values);

      const { accessToken, refreshToken } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      message.success("Login successful!");

      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      const status = error?.response?.status;
      const msg = error?.response?.data?.message;

      if (status === 403) {
        message.warning(
          msg || "Your account does not have permission to access this system"
        );
      } else {
        message.error(msg || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card title="Admin Login" className={styles.card}>
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

          <Button
            type="link"
            block
            style={{ marginTop: 8 }}
            onClick={() => navigate("/register")}
          >
            No account? Register
          </Button>
        </Form>
      </Card>
    </div>
  );
}
