import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type Inputs = {
  otp: string;
};

const VerifyEmailForm = () => {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await axios.post("http://localhost:3000/api/v1/auth/verify-email", data, {
        withCredentials: true,
      });

      toast.success("Email Verification Successfull!");

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
          type="test"
          placeholder="otp"
          className="border border-border p-5 rounded-2xl"
          {...register("otp")}
        />
        <button
          type="submit"
          className="border border-border p-5 rounded-2xl bg-red-600"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default VerifyEmailForm;
