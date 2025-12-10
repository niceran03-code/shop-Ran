import { Layout as AntLayout, Menu } from "antd";
import { Link, Outlet } from "react-router-dom";
import styles from "./Layout.module.css";

const { Header, Sider, Content } = AntLayout;

export const Layout = () => {
  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sider collapsed={false}>
        <div className={styles.logo}>Admin Panel</div>

        <Menu theme="dark" mode="inline">
          <Menu.Item key="1">
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>

          <Menu.Item key="2">
            <Link to="/products">Products</Link>
          </Menu.Item>

          <Menu.Item key="3">
            <Link to="/categories">Categories</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <AntLayout>
        <Header className={styles.header}>
          <span className={styles.headerTitle}>Admin System</span>
        </Header>

        <Content className={styles.content}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};
