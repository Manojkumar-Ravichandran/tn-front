import React from "react";
import { X } from "lucide-react";

/**
 * A theme-aware Modal component.
 */
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 transition-all duration-300">
            <div
                className="bg-background border border-border-theme rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl transform transition-all animate-in fade-in zoom-in duration-200"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-border-theme">
                    <h2 className="text-xl font-bold text-foreground">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-secondary-bg text-foreground/50 hover:text-foreground transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </div>

            {/* Overlay click to close */}
            <div
                className="absolute inset-0 -z-10"
                onClick={onClose}
            />
        </div>
    );
};

export default Modal;