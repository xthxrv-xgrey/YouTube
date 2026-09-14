import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { VerifyEmailInput } from "../../types/form-inputs";
import { verifyUser } from "../../services/auth.api";

const VerifyEmailForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<VerifyEmailInput>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<VerifyEmailInput> = async (data) => {
    try {
      await verifyUser(data);

      toast.success("Email Verification Successfull!");
      reset();

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ?? "Email verification failed";
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
        className="flex flex-col gap-5 p-10 border border-border rounded-xl"
      >
        <input
          type="text"
          placeholder="otp"
          className="border border-border p-5 rounded-2xl"
          {...register("otp")}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="border border-border p-5 rounded-2xl bg-red-600 disabled:opacity-50"
        >
          {isSubmitting ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
};

export default VerifyEmailForm;
