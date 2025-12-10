import { Layout as AntLayout, Menu } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import styles from "./Layout.module.css";

const { Header, Sider, Content } = AntLayout;

export const Layout = () => {
  const location = useLocation();

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider collapsible>
        <div className={styles.logo}>Admin Panel</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={[
            {
              key: "/dashboard",
              label: <Link to="/dashboard">Dashboard</Link>,
            },
            {
              key: "/products",
              label: <Link to="/products">Products</Link>,
            },
            {
              key: "/categories",
              label: <Link to="/categories">Categories</Link>,
            },
          ]}
        />
      </Sider>

      {/* Right Content Area */}
      <AntLayout>
        <Header className={styles.header}>
          <div className={styles.headerRight}>
            <span>Welcome Admin</span>
            <button
              className={styles.logout}
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </div>
        </Header>

        <Content className={styles.content}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};
