import { useState } from "react";
import Modal from "../../components/ui/Modal";
import ImagePreview from "../../components/ui/ImagePreview";
import { MapPin, Calendar, User, Eye, History, Compass, X } from "lucide-react";

const TemplePreviewModal = ({ temple, onClose }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    if (!temple) return null;

    const rawStatus = String(temple?.status || 'pending').toLowerCase();
    const colors = {
        approved: { bg: "bg-green-500/10", text: "text-green-500", dot: "bg-green-500", label: "APPROVED" },
        pending: { bg: "bg-orange-500/10", text: "text-orange-500", dot: "bg-orange-500", label: "PENDING" },
        rejected: { bg: "bg-red-500/10", text: "text-red-500", dot: "bg-red-500", label: "REJECTED" }
    };
    const config = colors[rawStatus] || colors.pending;

    const coordinates = temple?.location?.coordinates || [];

    return (
        <Modal isOpen={!!temple} onClose={onClose} title="Temple Details" maxWidth="max-w-4xl">
            <div className="space-y-6 text-foreground relative">

                {/* Full Image Overlay */}
                {selectedImage && (
                    <div className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
                        <button
                            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:scale-105 active:scale-95"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <img
                            src={selectedImage}
                            alt="Full Screen Temple"
                            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                        />
                    </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-6 md:items-start group">
                    <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-[2rem] overflow-hidden border-4 border-secondary-bg shadow-xl cursor-pointer hover:border-primary/50 transition-all hover:scale-[1.02] active:scale-[0.98]">
                        <ImagePreview src={temple?.images?.[0]} className="w-full h-full object-cover" onClick={(url) => setSelectedImage(url)} />
                    </div>

                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-xl md:text-3xl font-black tracking-tight">{temple?.name}</h3>
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-current/10 ${config.bg} ${config.text} text-[10px] font-black tracking-widest uppercase`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${config.dot} shadow-[0_0_8px_currentColor]`} />
                                {config.label}
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-foreground/40 text-xs font-bold uppercase tracking-wider flex-wrap">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{temple?.district?.name || "Unknown District"}</span>
                            <span className="mx-2 opacity-30">•</span>
                            <User className="w-3.5 h-3.5" />
                            <span>{temple?.deity?.name || "Unknown Deity"}</span>
                            {coordinates.length === 2 && (
                                <>
                                    <span className="mx-2 opacity-30">•</span>
                                    <Compass className="w-3.5 h-3.5" />
                                    <span>Lat: {coordinates[1].toFixed(4)}, Lng: {coordinates[0].toFixed(4)}</span>
                                </>
                            )}
                        </div>

                        <p className="text-sm md:text-base text-foreground/70 leading-relaxed mt-4 pt-4 border-t border-border-theme">
                            {temple?.description || "No description provided."}
                        </p>
                    </div>
                </div>

                {/* Gallery */}
                {temple?.images?.length > 1 && (
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground/30 flex items-center gap-2">
                            <Eye className="w-3.5 h-3.5" />
                            Complete Gallery
                        </h4>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-foreground/10 items-center">
                            {temple.images.map((img, idx) => (
                                <div
                                    key={idx}
                                    className="w-24 h-24 shrink-0 rounded-[1.2rem] overflow-hidden border border-border-theme bg-secondary-bg cursor-pointer hover:border-primary/50 transition-all hover:scale-105 active:scale-95 shadow-sm"
                                >
                                    <ImagePreview src={img} className="w-full h-full object-cover" onClick={(url) => setSelectedImage(url)} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Extended Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
                    <div className="bg-secondary-bg/30 border border-border-theme rounded-3xl p-5 md:p-6 space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2 border-b border-border-theme pb-3">
                            <History className="w-4 h-4" />
                            History & Origins
                        </h4>
                        <p className="text-sm md:text-[14px] text-foreground/70 leading-relaxed max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-foreground/10 pr-2">
                            {temple?.history || "No historical details have been added for this temple submission yet."}
                        </p>
                    </div>

                    <div className="bg-secondary-bg/30 border border-border-theme rounded-3xl p-5 md:p-6 space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2 border-b border-border-theme pb-3">
                            <Calendar className="w-4 h-4" />
                            Major Festivals
                        </h4>
                        <div className="flex flex-wrap gap-2.5">
                            {temple?.festivals?.length > 0 ? temple.festivals.map((fest, idx) => (
                                <span key={idx} className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm">
                                    {fest?.name || "Festival"}
                                </span>
                            )) : (
                                <span className="text-sm text-foreground/40 font-bold italic py-2">No specific festivals are linked to this temple.</span>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </Modal>
    );
};

export default TemplePreviewModal;
