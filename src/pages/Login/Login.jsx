import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../schemas/authSchema";
import { loginUser } from "../../api/authApi";
import useAuthStore from "../../store/authStore";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    try {

      const res = await loginUser(data);

      setAuth(res);

      navigate("/dashboard");

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 shadow rounded w-80"
      >

        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input
          {...register("email")}
          placeholder="Email"
          className="border p-2 w-full mb-2"
        />

        <p className="text-red-500 text-sm">
          {errors.email?.message}
        </p>

        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="border p-2 w-full mb-2"
        />

        <p className="text-red-500 text-sm">
          {errors.password?.message}
        </p>

        <button className="bg-blue-500 text-white w-full p-2 mt-3">
          Login
        </button>

      </form>
    </div>
  );
}