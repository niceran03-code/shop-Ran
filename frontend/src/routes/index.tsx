import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { LoginPage } from "../pages/Login/LoginPage";
import { RegisterPage } from "../pages/Register/RegisterPage";
import { DashboardPage } from "../pages/Dashboard/DashbosrdPage";
import { Layout } from "../components/Layout/Layout";
import LoginPage from "../pages/Login/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

  // 后台管理布局
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
