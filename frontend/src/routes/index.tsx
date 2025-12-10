import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RegisterPage } from "../pages/Register/RegisterPage";
import DashboardPage from "../pages/Dashboard/DashbosrdPage";
import { Layout } from "../components/Layout/Layout";
import LoginPage from "../pages/Login/LoginPage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import ProductsPage from "../pages/Products/ProductsPage";
import CategoriesPage from "../pages/Categories/CategoriesPage";
import CreateProductsPage from "../pages/Products/CreatProductsPage";
import EditProductsPage from "../pages/Products/EditProductsPage";
import RecycleBinPage from "../pages/Products/RecycleBinPage";
import CreateCategoryPage from "../pages/Categories/CreateCategoryPage";
import EditCategoryPage from "../pages/Categories/EditCategoryPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <DashboardPage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "categories", element: <CategoriesPage /> },
      {
        path: "products/create",
        element: <CreateProductsPage />,
      },
      {
        path: "products/edit/:id",
        element: <EditProductsPage />,
      },
      { path: "recycle-bin", element: <RecycleBinPage /> },
      {
        path: "categories",
        element: <CategoriesPage />,
      },
      {
        path: "categories/create",
        element: <CreateCategoryPage />,
      },
      {
        path: "categories/edit/:id",
        element: <EditCategoryPage />,
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
