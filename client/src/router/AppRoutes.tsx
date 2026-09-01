import { createBrowserRouter, RouterProvider } from "react-router";
import LoginPage from "../features/auth/presentation/pages/LoginPage";
import RegisterPage from "../features/auth/presentation/pages/RegisterPage";
import VerifyEmailPage from "../features/auth/presentation/pages/VerifyEmailPage";
import Home from "../Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
  {
    path: "/auth/register",
    element: <RegisterPage />,
  },
  {
    path: "/auth/verify-email",
    element: <VerifyEmailPage />,
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
