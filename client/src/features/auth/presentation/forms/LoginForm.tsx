import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type Inputs = {
  identifier: string;
  password: string;
};

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log("clicked");
    try {
      await axios.post("http://localhost:3000/api/v1/auth/login", data, {
        withCredentials: true,
      });

      toast.success("Login Successfull!");

      setTimeout(() => {
        navigate("/");
      }, 2000);

      reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Status:", error.response?.status);
        console.log("Response:", error.response?.data);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 p-10 border border-border rounded-xl"
      >
        <input
          type="text"
          placeholder="Enter username or email"
          className="border border-border p-5 rounded-2xl"
          {...register("identifier")}
        />
        {errors.identifier && <span>This field is required</span>}

        <input
          type="test"
          placeholder="password"
          className="border border-border p-5 rounded-2xl"
          {...register("password")}
        />
        {errors.password && <span>This field is required</span>}
        <button
          type="submit"
          className="border border-border p-5 rounded-2xl bg-red-600 active:bg-red-200"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
