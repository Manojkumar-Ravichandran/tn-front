import { Trash2, Maximize2 } from "lucide-react";

/**
 * A reusable image preview component for file uploads.
 * Now includes a clickable overlay for gallery view.
 */
const ImagePreview = ({ src, className = "w-16 h-16", onRemove, onClick, isLocal = false }) => {
  const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace('/api/v1', '');

  // Create preview URL
  const displayUrl = isLocal && src instanceof File
    ? URL.createObjectURL(src)
    : (typeof src === 'string' && src)
      ? (src.startsWith('http') ? src : `${BASE_URL}${src}`)
      : null;

  if (!displayUrl) {
    return (
      <div className={`${className} bg-secondary-bg flex items-center justify-center border border-border-theme rounded-xl`}>
        <div className="w-1/3 h-1/3 rounded-full border-2 border-foreground/10 opacity-30" />
      </div>
    );
  }

  return (
    <div className={`relative group/img ${className} overflow-visible`}>
      {/* Main Image */}
      <div
        className="w-full h-full rounded-xl overflow-hidden border border-border-theme cursor-zoom-in relative group"
        onClick={() => onClick && onClick(displayUrl)}
      >
        <img
          src={displayUrl}
          alt="Preview"
          className="w-full h-full object-cover bg-secondary-bg transition-all duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/100x100/f3f4f6/9ca3af?text=Error";
          }}
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Maximize2 className="w-4 h-4 text-white drop-shadow-md" />
        </div>
      </div>

      {/* Remove Button */}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-1.5 -right-1.5 bg-red-600 text-white p-1 rounded-full shadow-lg opacity-0 group-hover/img:opacity-100 transition-all scale-75 group-hover/img:scale-100 hover:bg-red-700 z-20 border border-white/20"
          title="Remove Image"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

export default ImagePreview;