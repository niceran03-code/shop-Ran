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
   * - /products            -> 高亮 Products（父菜单）
   * - /products/*          -> 高亮 Products（子菜单项自身高亮由 key=pathname 负责）
   * - /categories          -> 高亮 Categories
   * - /categories/*        -> 高亮 Categories
   * - /users /users/*      -> 高亮 Users
   */
  const selectedKeys =
    pathname === "/products" || pathname.startsWith("/products/")
      ? ["products", pathname] // products 父菜单 + 具体子项（如果存在）
      : pathname === "/categories" || pathname.startsWith("/categories/")
      ? ["categories", pathname]
      : pathname === "/users" || pathname.startsWith("/users/")
      ? ["/users"] // Users 是顶级 Menu.Item
      : [pathname];

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // 自动展开 Products / Categories 的子菜单
  useEffect(() => {
    if (pathname.startsWith("/products/") && pathname !== "/products") {
      setOpenKeys(["products"]);
    } else if (
      pathname.startsWith("/categories/") &&
      pathname !== "/categories"
    ) {
      setOpenKeys(["categories"]);
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

          {/* Products */}
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

          {/* Categories */}
          <Menu.SubMenu
            key="categories"
            title={
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/categories");
                }}
              >
                Categories
              </span>
            }
          >
            <Menu.Item key="/categories/create">
              <Link to="/categories/create">Create Category</Link>
            </Menu.Item>
          </Menu.SubMenu>

          {/* ✅ Users（新增顶级菜单项） */}
          <Menu.Item key="/users">
            <Link to="/users">Users</Link>
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
