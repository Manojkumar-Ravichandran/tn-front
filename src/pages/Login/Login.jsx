import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../features/auth/authSchema";
import { loginUser } from "../../features/auth/authApi";
import useAuthStore from "../../features/auth/authStore";
import { useNavigate } from "react-router-dom";
import SEO from "../../components/SEO";

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
    <div className="flex items-center justify-center py-20">
      <SEO
        title="Contributor Login"
        description="Login to the TN Temples contributor portal to manage and document Tamil Nadu temple data."
        canonical="/login"
        noIndex={true}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-background border border-border-theme p-8 shadow-xl rounded-2xl w-full max-w-md transition-all duration-300"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">Welcome Back</h2>
          <p className="text-foreground/60 mt-2">Login to manage your temple contributions</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5 ml-1">
              Email Address
            </label>
            <input
              {...register("email")}
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-xl bg-secondary-bg border border-border-theme text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1.5 ml-1">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-secondary-bg border border-border-theme text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-white w-full py-3 rounded-xl mt-8 font-bold text-lg shadow-lg shadow-primary/20 transform transition-all duration-200 active:scale-[0.98]"
        >
          Sign In
        </button>

        <div className="mt-8 text-center">
          <p className="text-sm text-foreground/60">
            Don't have permissions? <span className="text-primary font-semibold hover:underline cursor-pointer">Contact Admin</span>
          </p>
        </div>
      </form>
    </div>
  );
}