import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { UserPlus, Send, AlertCircle, Building2, MapPin } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { getDistricts } from '../../features/temples/masterApi';
import API from '../../api/axios';

const requestSchema = z.object({
    name: z.string().min(3, "Full name required"),
    email: z.string().email("Invalid email address"),
    district: z.string().min(1, "District selection required"),
    message: z.string().min(10, "Please provide more details (min 10 chars)")
});

/**
 * Modal for public users to apply as contributors.
 * Sends data to /contributors endpoint.
 */
const ContributorRequestModal = ({ isOpen, onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(requestSchema)
    });

    // Fetch districts for selection
    const { data: districtsData = [] } = useQuery({
        queryKey: ["districts"],
        queryFn: getDistricts
    });
    const districts = Array.isArray(districtsData) ? districtsData : [];

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);

            // Send to backend
            await API.post("/contributors", data);

            toast.success("Request Submitted! Our team will contact you soon.");
            reset();
            onClose();
        } catch (err) {
            console.error("Join Request Error:", err);
            toast.error(err?.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Become a Contributor">
            <div className="p-1">
                <div className="flex items-center gap-4 p-5 bg-primary/5 border border-primary/10 rounded-[2rem] mb-8 animate-in fade-in duration-500">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
                        <UserPlus className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-foreground uppercase tracking-widest">Join the Heritage Movement</h4>
                        <p className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest mt-0.5">Help us document Tamil Nadu's divine legacy</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Name & Email Group */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] ml-1">Full Name</label>
                            <div className="relative group">
                                <input
                                    {...register("name")}
                                    placeholder="Manojkumar"
                                    className={`w-full bg-secondary-bg border px-4 py-3.5 rounded-2xl text-sm focus:outline-none transition-all placeholder:text-foreground/10
                    ${errors.name ? 'border-red-500/40 ring-2 ring-red-500/5' : 'border-border-theme focus:border-primary/40'}`}
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold italic">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] ml-1">Email Address</label>
                            <input
                                {...register("email")}
                                placeholder="you@example.com"
                                className={`w-full bg-secondary-bg border px-4 py-3.5 rounded-2xl text-sm focus:outline-none transition-all placeholder:text-foreground/10
                  ${errors.email ? 'border-red-500/40 ring-2 ring-red-500/5' : 'border-border-theme focus:border-primary/40'}`}
                            />
                            {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold italic">{errors.email.message}</p>}
                        </div>
                    </div>

                    {/* District Selection */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] ml-1">Preferred District</label>
                        <div className="relative">
                            <select
                                {...register("district")}
                                className={`w-full bg-secondary-bg border px-4 py-3.5 rounded-2xl text-sm focus:outline-none appearance-none cursor-pointer transition-all
                  ${errors.district ? 'border-red-500/40' : 'border-border-theme focus:border-primary/40'}`}
                            >
                                <option value="" className="bg-background">Select a District</option>
                                {districts.map(d => (
                                    <option key={d._id} value={d.name} className="bg-background">{d.name}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/20">
                                <MapPin className="w-4 h-4" />
                            </div>
                        </div>
                        {errors.district && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold italic">{errors.district.message}</p>}
                    </div>

                    {/* Motivation Message */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] ml-1">Why do you want to join?</label>
                        <textarea
                            {...register("message")}
                            rows={4}
                            placeholder="Tell us about your interest in Tamil Nadu heritage..."
                            className={`w-full bg-secondary-bg border px-4 py-3.5 rounded-2xl text-sm focus:outline-none transition-all placeholder:text-foreground/10 resize-none
                ${errors.message ? 'border-red-500/40 ring-2 ring-red-500/5' : 'border-border-theme focus:border-primary/40'}`}
                        />
                        {errors.message && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold italic">{errors.message.message}</p>}
                    </div>

                    {/* Action Footer */}
                    <footer className="pt-6 flex flex-col sm:flex-row justify-end gap-3 border-t border-border-theme mt-4">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => { reset(); onClose(); }}
                            className="px-8 py-3.5 rounded-2xl text-[11px] font-black text-foreground/30 hover:text-foreground transition-all uppercase tracking-widest disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-10 py-3.5 bg-primary text-white rounded-2xl font-black text-[11px] shadow-xl shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2 uppercase tracking-[0.2em]"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Sending Request...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Submit Application
                                </>
                            )}
                        </button>
                    </footer>
                </form>
            </div>
        </Modal>
    );
};

export default ContributorRequestModal;
