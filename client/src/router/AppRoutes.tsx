import { createBrowserRouter, RouterProvider } from "react-router";
import LoginPage from "@/features/auth/presentation/pages/LoginPage";
import RegisterPage from "@/features/auth/presentation/pages/RegisterPage";
import VerifyEmailPage from "@/features/auth/presentation/pages/VerifyEmailPage";
import HomePage from "@/pages/HomePage";
// import WatchPage from "@/pages/WatchPage";
// import ChannelPage from "@/pages/ChannelPage";
import MainLayout from "@/layout/MainLayout";
import AuthLayout from "@/layout/AuthLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      // { path: "watch/:videoId", element: <WatchPage /> },
      // { path: "channel/:channelId", element: <ChannelPage /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "verify-email", element: <VerifyEmailPage /> },
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
