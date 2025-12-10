import { Button, Form, Input, Card } from "antd";
import styles from "./RegisterPage.module.css";

export const RegisterPage = () => {
  const onFinish = (values: any) => {
    console.log("Register:", values);
  };

  return (
    <div className={styles.container}>
      <Card title="Register" className={styles.card}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true }]}>
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form>
      </Card>
    </div>
  );
};
