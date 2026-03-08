import React from "react";
import { X } from "lucide-react";

/**
 * A theme-aware and responsive Modal component.
 */
const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-2xl" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-start md:items-center justify-center z-[1000] p-3 md:p-6 transition-all duration-500 overflow-y-auto">

            <div
                className={`relative bg-background border border-border-theme rounded-3xl w-full ${maxWidth} shadow-2xl flex flex-col my-auto max-h-[95vh] overflow-hidden transition-all duration-300 transform`}
            >
                {/* Header */}
                <header className="flex justify-between items-center px-6 py-4 border-b border-border-theme bg-secondary-bg/20">
                    <h2 className="text-lg md:text-xl font-black text-foreground tracking-tight">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-foreground/10 text-foreground/40 hover:text-foreground transition-all active:scale-90"
                    >
                        <X className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </header>

                {/* Content Area */}
                <div className="px-4 py-6 md:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-foreground/10">
                    {children}
                </div>
            </div>

            {/* Clickable Backdrop */}
            <div
                className="absolute inset-0 -z-10 cursor-default"
                onClick={onClose}
            />
        </div>
    );
};

export default Modal;