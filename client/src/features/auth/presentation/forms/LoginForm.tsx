import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { LoginInput } from "../../types/form-inputs";
import { loginUser } from "../../services/auth.api";
import { useAuthStore } from "@/shared/store/authStore";
import { isAxiosError } from "axios";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>();

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    try {
      const { user, accessToken } = await loginUser(data);
      setAuth(user, accessToken);
      toast.success("Logged in successfully");
      navigate("/");
    } catch (error) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message ?? "Login failed";
        toast.error(message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 p-10 border border-border rounded-xl w-100"
      >
        <input
          type="text"
          placeholder="Enter username or email"
          autoComplete="username"
          className="border border-border p-5 rounded-2xl"
          {...register("identifier", { required: true })}
        />
        {errors.identifier && <span>This field is required</span>}

        <input
          type="password"
          placeholder="password"
          autoComplete="current-password"
          className="border border-border p-5 rounded-2xl"
          {...register("password", { required: true })}
        />
        {errors.password && <span>This field is required</span>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="border border-border p-5 rounded-2xl bg-red-600 active:bg-red-200 disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
        {/* Register redirect */}
        <p className="mt-6 text-center text-sm text-muted">
          Don't have an account?{" "}
          <Link
            to="/auth/register"
            className="font-medium text-primary transition-colors hover:text-primary-hover hover:underline"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
