import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { templeSchema } from "../../features/temples/templeSchema";
import { createTemple } from "../../features/temples/templeApi";
import { getDistricts, getDeities, getFestivals } from "../../features/temples/masterApi";
import Modal from "../../components/ui/Modal";
import ImagePreview from "../../components/ui/ImagePreview";
import { useState, useEffect } from "react";
import { X, Plus, AlertCircle, MapPin, Navigation, MousePointer2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issues in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import shadowIcon from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: shadowIcon,
});

/**
 * Helper to capture map clicks and fix map size issue
 */
const MapEvents = ({ onLocationSelect }) => {
  const map = useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    // Rapidly invalidating size multiple times over 1 second guarantees 
    // the map matches its container perfectly after all CSS transitions finish.
    const intervals = [100, 300, 500, 800, 1000];
    const timers = intervals.map(t => setTimeout(() => map.invalidateSize(), t));

    return () => timers.forEach(clearTimeout);
  }, [map]);

  return null;
};

const AddTempleModal = ({ isOpen, onClose }) => {
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState("");
  const [locationMode, setLocationMode] = useState('map'); // 'map' | 'manual'

  // Default center (Tamil Nadu area)
  const defaultPos = [11.1271, 78.6569];

  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(templeSchema),
    defaultValues: {
      name: "", deity: "", district: "", festivals: [], description: "", history: "",
      latitude: "11.1271", longitude: "78.6569"
    }
  });

  const watchLat = watch("latitude");
  const watchLng = watch("longitude");

  // CLEANUP
  useEffect(() => {
    if (!isOpen) {
      reset();
      setImages([]);
      setSelectedGalleryImg(null);
      setIsDragging(false);
      setImageError("");
      setLocationMode('map');
    }
  }, [isOpen, reset]);

  // Master Data
  const { data: districtsData = [] } = useQuery({ queryKey: ["districts"], queryFn: getDistricts });
  const { data: deitiesData = [] } = useQuery({ queryKey: ["deities"], queryFn: getDeities });
  const { data: festivalsData = [] } = useQuery({ queryKey: ["festivals"], queryFn: getFestivals });

  const districts = Array.isArray(districtsData) ? districtsData : [];
  const deities = Array.isArray(deitiesData) ? deitiesData : [];
  const festivals = Array.isArray(festivalsData) ? festivalsData : [];

  const processFiles = (files) => {
    setImageError("");
    const validFiles = files.filter(f => ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(f.type));
    setImages(prev => {
      const total = [...prev, ...validFiles];
      if (total.length > 10) {
        setImageError("Maximum 10 images allowed");
        return total.slice(0, 10);
      }
      return total;
    });
  };

  const handleImageChange = (e) => processFiles(Array.from(e.target.files));
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) processFiles(Array.from(e.dataTransfer.files));
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (images.length <= 11) setImageError("");
  };

  const setCoords = (lat, lng) => {
    setValue("latitude", lat.toFixed(6).toString());
    setValue("longitude", lng.toFixed(6).toString());
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'festivals' && Array.isArray(data[key])) {
          data[key].forEach(val => formData.append("festivals", val));
        } else if (key !== 'latitude' && key !== 'longitude') {
          formData.append(key, data[key]);
        }
      });

      // Combine lat/lng for backend
      const lat = parseFloat(data.latitude);
      const lng = parseFloat(data.longitude);
      formData.append("location", JSON.stringify([lat, lng]));

      images.forEach(img => formData.append("images", img));

      await createTemple(formData);
      queryClient.invalidateQueries(["temples"]);
      onClose();
    } catch (err) {
      console.error("Submission Failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Submit New Temple Heritage">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-foreground p-1">

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] ml-1">Official Name</label>
              <input
                {...register("name")}
                placeholder="e.g. Arulmigu Meenakshi Amman Temple"
                className={`w-full bg-secondary-bg border px-4 py-3 rounded-2xl text-sm focus:outline-none transition-all 
                  ${errors.name ? 'border-red-500/40 ring-2 ring-red-500/5' : 'border-border-theme focus:border-primary/40'}`}
              />
              {errors.name && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold italic">{errors.name?.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] ml-1">Deity</label>
                <select
                  {...register("deity")}
                  className={`w-full bg-secondary-bg border px-4 py-3 rounded-2xl text-sm focus:outline-none appearance-none cursor-pointer
                      ${errors.deity ? 'border-red-500/40' : 'border-border-theme'}`}
                >
                  <option value="" className="bg-background">Select Deity</option>
                  {deities.map(d => <option key={d._id} value={d._id} className="bg-background">{d.name}</option>)}
                </select>
                {errors.deity && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold italic">{errors.deity?.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] ml-1">District</label>
                <select
                  {...register("district")}
                  className={`w-full bg-secondary-bg border px-4 py-3 rounded-2xl text-sm focus:outline-none appearance-none cursor-pointer
                      ${errors.district ? 'border-red-500/40' : 'border-border-theme'}`}
                >
                  <option value="" className="bg-background">Select District</option>
                  {districts.map(d => <option key={d._id} value={d._id} className="bg-background">{d.name}</option>)}
                </select>
                {errors.district && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold italic">{errors.district?.message}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] ml-1">Festivals</label>
              <select
                {...register("festivals")}
                multiple
                className="w-full bg-secondary-bg border border-border-theme px-4 py-3 rounded-2xl text-sm min-h-[120px] focus:outline-none focus:border-primary/40 scrollbar-hide"
              >
                {festivals.map(f => <option key={f._id} value={f._id} className="bg-background py-2 px-3 border-b border-foreground/5 cursor-pointer">{f.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] ml-1">Description</label>
              <textarea
                {...register("description")}
                placeholder="Spiritual significance..."
                className={`w-full bg-secondary-bg border px-4 py-3 rounded-2xl text-sm min-h-[80px] focus:outline-none 
                  ${errors.description ? 'border-red-500/40' : 'border-border-theme focus:border-primary/40'}`}
              />
              {errors.description && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold italic">{errors.description?.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] ml-1">History & Legends</label>
              <textarea
                {...register("history")}
                placeholder="Ancient origins and architecture..."
                className="w-full bg-secondary-bg border border-border-theme px-4 py-3 rounded-2xl text-sm min-h-[100px] focus:outline-none"
              />
            </div>
          </div>

          {/* NEW LOCATION SELECT SECTION */}
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <label className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">Geographic Location</label>
              </div>

              {/* MODE TOGGLE */}
              <div className="bg-secondary-bg border border-border-theme p-1 rounded-xl flex items-center gap-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setLocationMode('map')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black tracking-tight transition-all ${locationMode === 'map' ? 'bg-primary text-white shadow-md' : 'text-foreground/40 hover:text-foreground'}`}
                >
                  <Navigation className="w-3 h-3" />
                  MAP PICKER
                </button>
                <button
                  type="button"
                  onClick={() => setLocationMode('manual')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black tracking-tight transition-all ${locationMode === 'manual' ? 'bg-primary text-white shadow-md' : 'text-foreground/40 hover:text-foreground'}`}
                >
                  <MousePointer2 className="w-3 h-3" />
                  MANUAL
                </button>
              </div>
            </div>

            {locationMode === 'map' ? (
              <div className="h-[250px] w-full rounded-[2.5rem] overflow-hidden border border-border-theme relative shadow-inner group">
                <MapContainer
                  center={[parseFloat(watchLat), parseFloat(watchLng)]}
                  zoom={13}
                  style={{ height: '100%', width: '100%', zIndex: 10 }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[parseFloat(watchLat), parseFloat(watchLng)]} draggable={true} eventHandlers={{
                    dragend: (e) => {
                      const marker = e.target;
                      const position = marker.getLatLng();
                      setCoords(position.lat, position.lng);
                    }
                  }} />
                  <MapEvents onLocationSelect={setCoords} />
                </MapContainer>
                <div className="absolute bottom-4 left-4 z-[500] bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-border-theme shadow-lg flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-foreground/60 uppercase tracking-widest leading-none">
                    {parseFloat(watchLat).toFixed(4)}, {parseFloat(watchLng).toFixed(4)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 bg-secondary-bg/20 border border-border-theme rounded-[2.5rem] p-6 animate-in slide-in-from-right-4 transition-all duration-500">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest ml-1">Latitude</label>
                  <input
                    {...register("latitude")}
                    type="text"
                    placeholder="11.1271"
                    className={`w-full bg-secondary-bg border px-4 py-3 rounded-2xl text-sm focus:outline-none transition-all ${errors.latitude ? 'border-red-500/40' : 'border-border-theme focus:border-primary/40'}`}
                  />
                  {errors.latitude && <p className="text-red-500 text-[9px] font-bold italic">{errors.latitude.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-foreground/40 uppercase tracking-widest ml-1">Longitude</label>
                  <input
                    {...register("longitude")}
                    type="text"
                    placeholder="78.6569"
                    className={`w-full bg-secondary-bg border px-4 py-3 rounded-2xl text-sm focus:outline-none transition-all ${errors.longitude ? 'border-red-500/40' : 'border-border-theme focus:border-primary/40'}`}
                  />
                  {errors.longitude && <p className="text-red-500 text-[9px] font-bold italic">{errors.longitude.message}</p>}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-end px-1">
              <label className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">Visual Documentation</label>
              <span className={`text-[10px] font-black uppercase tracking-widest ${images.length >= 10 ? 'text-orange-500' : 'text-foreground/20'}`}>
                {images.length} / 10
              </span>
            </div>

            <div
              className={`relative w-full border-2 border-dashed rounded-[2.5rem] py-10 px-6 flex flex-col items-center justify-center transition-all duration-300 group
                  ${isDragging ? 'border-primary bg-primary/5 ring-8 ring-primary/5' : 'border-border-theme bg-secondary-bg/10'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file" multiple className="hidden" id="main-file-input" accept=".png,.jpg,.jpeg,.webp" onChange={handleImageChange} disabled={images.length >= 10}
              />
              <label htmlFor="main-file-input" className={`flex flex-col items-center gap-4 text-center ${images.length >= 10 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 hover:border-primary/40 transition-all duration-300">
                  <Plus className="w-6 h-6 text-primary stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-black text-primary tracking-tight">{images.length >= 10 ? "Limit Reached" : "Select Temple Images"}</p>
                  <p className="text-[11px] font-bold text-foreground/30 uppercase tracking-widest">JPG, PNG or WEBP (MAX 10 PHOTOS)</p>
                </div>
              </label>
            </div>

            {imageError && (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold uppercase tracking-widest animate-in slide-in-from-top-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {imageError}
              </div>
            )}

            {images.length > 0 && (
              <div className="bg-secondary-bg/20 border border-border-theme rounded-[2.5rem] p-5 mt-4">
                <div className="grid grid-cols-5 gap-4">
                  {images.map((file, idx) => (
                    <ImagePreview key={idx} src={file} isLocal={true} className="aspect-square" onRemove={() => removeImage(idx)} onClick={(url) => setSelectedGalleryImg(url)} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <footer className="pt-8 flex flex-col sm:flex-row justify-end gap-3 border-t border-border-theme">
            <button type="button" onClick={onClose} className="px-8 py-3 rounded-2xl text-[11px] font-black text-foreground/40 hover:text-foreground transition-all uppercase tracking-widest">Discard</button>
            <button type="submit" disabled={isSubmitting} className="px-10 py-3.5 bg-primary text-white rounded-2xl font-black text-[11px] shadow-xl shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2 uppercase tracking-widest">
              {isSubmitting ? "Processing..." : "Publish Listing"}
            </button>
          </footer>
        </form>
      </Modal>

      {selectedGalleryImg && (
        <div className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <button onClick={() => setSelectedGalleryImg(null)} className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors border border-white/10">
            <X className="w-6 h-6" />
          </button>
          <img src={selectedGalleryImg} alt="Full Preview" className="max-w-full max-h-full object-contain rounded-2xl animate-in zoom-in-95 duration-500" />
        </div>
      )}
    </>
  );
};

export default AddTempleModal;