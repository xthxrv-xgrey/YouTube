import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type Inputs = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
};

const RegisterForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log("clicked");
    try {
      await axios.post("http://localhost:3000/api/v1/auth/register", data, {
        withCredentials: true,
      });

      toast.success("Otp Sent Successfully!");

      setTimeout(() => {
        navigate("/auth/verify-email");
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
        <div className="flex flex-row gap-5">
          <input
            type="text"
            placeholder="First Name"
            className="border border-border p-5 rounded-2xl"
            {...register("firstName")}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="border border-border p-5 rounded-2xl"
            {...register("lastName")}
          />
        </div>
        <input
          type="text"
          placeholder="username"
          className="border border-border p-5 rounded-2xl"
          {...register("username")}
        />
        {errors.username && <span>This field is required</span>}

        <input
          type="text"
          placeholder="email"
          className="border border-border p-5 rounded-2xl"
          {...register("email")}
        />
        {errors.email && <span>This field is required</span>}

        <input
          type="test"
          placeholder="password"
          className="border border-border p-5 rounded-2xl"
          {...register("password")}
        />
        {errors.password && <span>This field is required</span>}
        <button
          type="submit"
          className="border border-border p-5 rounded-2xl bg-red-600 active:bg-red-800"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
