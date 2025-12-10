import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RegisterPage } from "../pages/Register/RegisterPage";
import { DashboardPage } from "../pages/Dashboard/DashbosrdPage";
import { Layout } from "../components/Layout/Layout";
import LoginPage from "../pages/Login/LoginPage";
import { ProtectedRoute } from "../components/ProtectedRoute";

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
