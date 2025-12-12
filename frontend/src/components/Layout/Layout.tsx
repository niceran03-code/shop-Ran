// frontend/src/components/Layout/Layout.tsx
import { Layout as AntLayout, Menu } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./Layout.module.css";

const { Header, Sider, Content } = AntLayout;

export const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  /**
   * selectedKeys 规则：
   * - /products        -> 选中 products（高亮 Products）
   * - /products/create -> 高亮子菜单
   * - /products/recycle-> 高亮子菜单
   * - /products/edit/:id -> 选中 products（高亮 Products）
   */
  const selectedKeys =
    pathname === "/products" || pathname.startsWith("/products/edit")
      ? ["products"]
      : [pathname];

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // 只有进入子页面才展开
  useEffect(() => {
    if (pathname.startsWith("/products/") && pathname !== "/products") {
      setOpenKeys(["products"]);
    } else {
      setOpenKeys([]);
    }
  }, [pathname]);

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <div className={styles.logo}>Admin Panel</div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
        >
          <Menu.Item key="/dashboard">
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>

          <Menu.SubMenu
            key="products"
            title={
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/products");
                }}
              >
                Products
              </span>
            }
          >
            <Menu.Item key="/products/create">
              <Link to="/products/create">Create Product</Link>
            </Menu.Item>

            <Menu.Item key="/products/recycle">
              <Link to="/products/recycle">Recycle Bin</Link>
            </Menu.Item>
          </Menu.SubMenu>

          <Menu.Item key="/categories">
            <Link to="/categories">Categories</Link>
          </Menu.Item>
        </Menu>
      </Sider>

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
