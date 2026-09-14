import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { RegisterInput } from "../../types/form-inputs";
import { registerUser } from "../../services/auth.api";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
    try {
      await registerUser(data);

      toast.success("OTP sent successfully");

      navigate("/auth/verify-email");
    } catch (error) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message ?? "Registration failed";

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
          placeholder="Enter your name"
          autoComplete="name"
          className="border border-border p-5 rounded-2xl"
          {...register("name", { required: true })}
        />
        {errors.name && <span>This field is required</span>}

        <input
          type="text"
          placeholder="Enter username"
          autoComplete="username"
          className="border border-border p-5 rounded-2xl"
          {...register("username", { required: true })}
        />
        {errors.username && <span>This field is required</span>}

        <input
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          className="border border-border p-5 rounded-2xl"
          {...register("email", { required: true })}
        />
        {errors.email && <span>This field is required</span>}

        <input
          type="password"
          placeholder="Enter password"
          autoComplete="new-password"
          className="border border-border p-5 rounded-2xl"
          {...register("password", { required: true })}
        />
        {errors.password && <span>This field is required</span>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="border border-border p-5 rounded-2xl bg-red-600 active:bg-red-200 disabled:opacity-50"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
        {/* Login redirect */}
        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-medium text-primary transition-colors hover:text-primary-hover hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
