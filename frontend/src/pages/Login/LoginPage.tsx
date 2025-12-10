import { useState } from "react";
import { Card, Form, Input, Button, message } from "antd";
import api from "../../utils/axios";
import styles from "./LoginPage.module.css";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", values); // 使用 api（自动带 baseURL）

      const { accessToken, refreshToken } = res.data;

      // 保存 Token
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      message.success("Login successful!");

      // 跳转到后台首页
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      message.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card title="Admin Login" className={styles.card}>
        <Form onFinish={handleLogin} layout="vertical">
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
        </Form>
      </Card>
    </div>
  );
}
