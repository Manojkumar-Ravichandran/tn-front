import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { setPassword } from '../../features/auth/authApi';
import toast from 'react-hot-toast';
import { ShieldCheck, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const setPasswordSchema = z.object({
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

const SetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const token = searchParams.get('token');

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(setPasswordSchema)
    });

    const onSubmit = async (data) => {
        if (!token) {
            toast.error("Invalid or expired session. Please contact support.");
            return;
        }

        try {
            setIsSubmitting(true);
            await setPassword({ token, password: data.password });
            toast.success("Security Credentials Established!");
            navigate('/login');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to establish password");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-6">
                <div className="bg-red-500/5 border border-red-500/10 p-10 rounded-[2.5rem] text-center max-w-md w-full">
                    <ShieldCheck className="w-12 h-12 text-red-500 mx-auto mb-4 opacity-30" />
                    <h2 className="text-xl font-black text-foreground mb-2">Invalid Invite Link</h2>
                    <p className="text-foreground/40 text-sm font-medium">The link you followed is invalid or has already been used.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6 py-20 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-[400px] bg-primary/5 blur-[100px] rounded-full -z-10 animate-pulse"></div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-background border border-border-theme p-10 shadow-2xl rounded-[3rem] w-full max-w-md relative z-10 transition-all duration-500 group"
            >
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 shadow-inner ring-8 ring-primary/5 group-hover:scale-110 transition-transform duration-500">
                        <Lock className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-black text-foreground tracking-tight leading-none mb-3">Secure Your Access</h2>
                    <p className="text-foreground/40 text-sm font-medium uppercase tracking-widest leading-relaxed">
                        Establish your internal contributor <br /> credentials to proceed
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-1">New Password</label>
                        <div className="relative group/input">
                            <input
                                {...register("password")}
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className={`w-full bg-secondary-bg border px-4 py-4 rounded-2xl text-sm focus:outline-none transition-all placeholder:text-foreground/10
                                    ${errors.password ? 'border-red-500/40 ring-2 ring-red-500/5' : 'border-border-theme focus:border-primary/40'}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/20 hover:text-primary transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold italic line-clamp-1">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-1">Confirm Credentials</label>
                        <input
                            {...register("confirmPassword")}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className={`w-full bg-secondary-bg border px-4 py-4 rounded-2xl text-sm focus:outline-none transition-all placeholder:text-foreground/10
                                ${errors.confirmPassword ? 'border-red-500/40 ring-2 ring-red-500/5' : 'border-border-theme focus:border-primary/40'}`}
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold italic">{errors.confirmPassword.message}</p>}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white py-4.5 rounded-2xl mt-10 font-black text-[11px] shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2 uppercase tracking-[0.3em]"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Establishing Secure Tunnel...
                        </>
                    ) : (
                        "Activate Account"
                    )}
                </button>

                <div className="mt-8 text-center border-t border-border-theme pt-8">
                    <p className="text-[10px] text-foreground/30 font-black uppercase tracking-widest leading-relaxed">
                        Security Notice: Ensure your password <br />
                        is strong and unique.
                    </p>
                </div>
            </form>
        </div>
    );
};

export default SetPassword;
