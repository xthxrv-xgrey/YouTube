import { Toaster } from "sonner";
import AppRoutes from "./router/AppRoutes";
import { useEffect } from "react";
import { useTheme } from "./shared/hooks/useTheme";

const App = () => {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      <Toaster />
      <AppRoutes />
    </>
  );
};

export default App;
