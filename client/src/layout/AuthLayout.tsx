import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="auth-shell">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
