import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Navigation, Calendar, Camera, Clock, AlertCircle, Search, ChevronRight, History } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import shadowIcon from 'leaflet/dist/images/marker-shadow.png';
import { getTempleBySlug } from '../../features/temples/templeApi';
import SEO from '../../components/SEO';

// Fix Leaflet default marker icons in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: shadowIcon });

const TempleDetail = () => {
    const { slug } = useParams();
    const [selectedImage, setSelectedImage] = useState(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['temple', slug],
        queryFn: () => getTempleBySlug(slug),
    });

    const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace('/api/v1', '');

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center bg-background">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
                    <p className="text-foreground/50 font-black tracking-widest text-xs uppercase">Unveiling History...</p>
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center bg-background text-center px-4">
                <div>
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-black text-foreground mb-2">Temple Not Found</h1>
                    <p className="text-foreground/50 font-medium mb-8">The sacred site you are looking for might have been moved or doesn't exist.</p>
                    <Link to="/" className="px-8 py-4 bg-primary text-white rounded-[2rem] font-black text-sm hover:bg-primary/90 transition-all">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    // `data` is the temple object directly from the API
    const temple = data;

    const headerImage = temple?.images?.[0] ? `${BASE_URL}${temple.images[0]}` : null;

    // Format coordinate data
    const coords = temple?.location?.coordinates || [];

    const seoDescription = temple?.description
        ? temple.description.slice(0, 160)
        : `Discover ${temple?.name} — an ancient temple dedicated to ${temple?.deity?.name || 'the divine'} in ${temple?.district?.name || 'Tamil Nadu'}. Explore its history, timings, festivals, and more.`;
    const seoImage = headerImage || undefined;

    return (
        <div className="min-h-screen bg-background pb-20">
            <SEO
                title={`${temple?.name} — ${temple?.district?.name || 'Tamil Nadu'}`}
                description={seoDescription}
                keywords={`${temple?.name}, ${temple?.deity?.name || ''} temple, ${temple?.district?.name || ''} temple, Tamil Nadu temples`}
                image={seoImage}
                canonical={`/temples/${slug}`}
            />

            {/* Full Screen Image Viewer Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-[2000] bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
                    <button
                        className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:scale-105 active:scale-95 z-50"
                        onClick={() => setSelectedImage(null)}
                    >
                        <span className="sr-only">Close</span>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <img
                        src={selectedImage}
                        alt="Temple Zoomed"
                        className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
                    />
                </div>
            )}

            {/* Breadcrumbs Component */}
            <div className="pt-24 pb-4 container mx-auto px-4 md:px-8">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-foreground/40">
                    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <Link to={`/districts/${temple?.district?.name?.toLowerCase()}`} className="hover:text-primary transition-colors">{temple?.district?.name || 'District'}</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-foreground/80">{temple?.name}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8">

                {/* HUGE HERO BANNER */}
                <div className="relative w-full h-[500px] md:h-[600px] rounded-[2rem] md:rounded-[3rem] overflow-hidden mb-12 border border-border-theme shadow-2xl">
                    <img
                        src={headerImage}
                        alt={temple?.name}
                        className="absolute inset-0 w-full h-full object-cover rounded-[3rem] transition-transform duration-1000 hover:scale-105"
                    />
                    {/* Gradients */}
                    <div className="absolute inset-x-0 bottom-0 h-[80%] bg-gradient-to-t from-black/95 via-black/60 to-transparent rounded-b-[3rem]" />
                    <div className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-black/40 to-transparent rounded-t-[3rem]" />

                    {/* Hero Content */}
                    <div className="absolute inset-x-0 bottom-0 p-8 md:p-14 flex flex-col justify-end h-full">
                        <div className="flex gap-2 flex-wrap mb-4">
                            <span className="bg-primary text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full shadow-lg">
                                {temple?.deity?.name ? `${temple.deity.name} Shrine` : 'Sacred Site'}
                            </span>
                            <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full">
                                Active Site
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1] mb-6 drop-shadow-md max-w-4xl">
                            {temple?.name}
                        </h1>

                        <p className="text-white/80 text-lg md:text-xl font-medium max-w-3xl mb-10 leading-relaxed text-shadow-sm">
                            {temple?.description || "An architectural masterpiece dedicated to the divine, situated in the heart of the temple city."}
                        </p>

                        <div className="flex flex-wrap items-center gap-4">
                            <button className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95">
                                <Calendar className="w-4 h-4" /> Book Pooja
                            </button>
                            <button
                                className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all active:scale-95"
                                onClick={() => {
                                    if (coords.length > 0) {
                                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${coords[1]},${coords[0]}`, '_blank');
                                    }
                                }}
                            >
                                <Navigation className="w-4 h-4" /> Get Directions
                            </button>
                        </div>
                    </div>
                </div>

                {/* DETAILS LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:items-start max-w-[1400px] mx-auto">

                    {/* MAIN CONTENT (LEFT 8 COLS) */}
                    <div className="lg:col-span-8 flex flex-col gap-14">

                        {/* History Section */}
                        <section className="space-y-6">
                            <h2 className="text-2xl md:text-3xl font-black text-foreground flex items-center gap-3">
                                <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <History className="w-5 h-5" />
                                </span>
                                Ancient History & Significance
                            </h2>
                            <div className="text-foreground/70 leading-[1.8] text-base md:text-lg space-y-6 font-medium bg-transparent">
                                {temple?.history ? (
                                    <p className="whitespace-pre-line">{temple.history}</p>
                                ) : (
                                    <>
                                        <p>
                                            This magnificent temple dates back to the early centuries of the Common Era, though most of its present structure was built during later royal dynasties. Legend states that the temple was a vital center for spiritual and community gatherings.
                                        </p>
                                        <p>
                                            The complex is a physical representation of the <strong className="text-primary">Dravidian architectural style</strong>, featuring massive gopurams (gateway towers), intricately carved pillars, and sprawling courtyards.
                                        </p>
                                        <div className="border-l-4 border-primary pl-6 py-2 my-8 italic text-foreground/50 font-medium">
                                            "The temple is often cited as a candidate for the New Seven Wonders of the World due to its intricate carvings and spiritual magnetism."
                                        </div>
                                    </>
                                )}
                            </div>
                        </section>

                        {/* Timings Section */}
                        <section className="space-y-6 pt-6 border-t border-border-theme/50">
                            <h2 className="text-2xl md:text-3xl font-black text-foreground flex items-center gap-3">
                                <span className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                                    <Clock className="w-5 h-5" />
                                </span>
                                Timings & Daily Pooja Schedule
                            </h2>

                            <div className="bg-secondary-bg/30 border border-border-theme rounded-3xl overflow-hidden mt-6">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-secondary-bg">
                                            <th className="py-4 px-6 text-[10px] uppercase font-black tracking-widest text-foreground/40 border-b border-border-theme">Ritual Name</th>
                                            <th className="py-4 px-6 text-[10px] uppercase font-black tracking-widest text-foreground/40 border-b border-border-theme">Timing</th>
                                            <th className="py-4 px-6 text-[10px] uppercase font-black tracking-widest text-foreground/40 border-b border-border-theme">Significance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-theme/50">
                                        <tr className="hover:bg-foreground/5 transition-colors">
                                            <td className="py-5 px-6 font-bold text-primary text-sm">Thiruvananthal Pooja</td>
                                            <td className="py-5 px-6 font-bold text-foreground text-sm">05:00 AM - 06:00 AM</td>
                                            <td className="py-5 px-6 font-medium text-foreground/60 text-sm">Early morning awakening ritual</td>
                                        </tr>
                                        <tr className="hover:bg-foreground/5 transition-colors bg-secondary-bg/10">
                                            <td className="py-5 px-6 font-bold text-primary text-sm">Kaalasanthi Pooja</td>
                                            <td className="py-5 px-6 font-bold text-foreground text-sm">06:30 AM - 07:15 AM</td>
                                            <td className="py-5 px-6 font-medium text-foreground/60 text-sm">Morning prayers & offerings</td>
                                        </tr>
                                        <tr className="hover:bg-foreground/5 transition-colors">
                                            <td className="py-5 px-6 font-bold text-primary text-sm">Uchikala Pooja</td>
                                            <td className="py-5 px-6 font-bold text-foreground text-sm">10:30 AM - 11:15 AM</td>
                                            <td className="py-5 px-6 font-medium text-foreground/60 text-sm">Mid-day ritual</td>
                                        </tr>
                                        <tr className="hover:bg-foreground/5 transition-colors bg-secondary-bg/10">
                                            <td className="py-5 px-6 font-bold text-primary text-sm">Sayarakshai Pooja</td>
                                            <td className="py-5 px-6 font-bold text-foreground text-sm">04:30 PM - 05:15 PM</td>
                                            <td className="py-5 px-6 font-medium text-foreground/60 text-sm">Evening lighting ceremony</td>
                                        </tr>
                                        <tr className="hover:bg-foreground/5 transition-colors">
                                            <td className="py-5 px-6 font-bold text-primary text-sm">Palliarai Pooja</td>
                                            <td className="py-5 px-6 font-bold text-foreground text-sm">09:30 PM - 10:00 PM</td>
                                            <td className="py-5 px-6 font-medium text-foreground/60 text-sm">Closing nightly procession</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-[11px] font-bold text-foreground/30 italic px-4 uppercase tracking-widest mt-2">
                                Note: Timings may vary during festival days and solar/lunar eclipses.
                            </p>
                        </section>

                        {/* Gallery Grid */}
                        <section className="space-y-6 pt-6 border-t border-border-theme/50">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl md:text-3xl font-black text-foreground flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-xl bg-orange-600/10 flex items-center justify-center text-orange-600 shrink-0">
                                        <Camera className="w-5 h-5" />
                                    </span>
                                    Image Gallery
                                </h2>
                                {temple?.images?.length > 5 && (
                                    <span className="text-primary text-xs font-black uppercase tracking-widest cursor-pointer hover:underline opacity-80">
                                        View All {temple.images.length} Photos
                                    </span>
                                )}
                            </div>

                            {temple?.images?.length > 1 ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-3 h-[300px] md:h-[450px]">
                                    {/* Big Image on Left */}
                                    <div
                                        className="col-span-2 row-span-2 rounded-[2rem] overflow-hidden cursor-pointer shadow-md group relative border border-border-theme"
                                        onClick={() => setSelectedImage(`${BASE_URL}${temple.images[0]}`)}
                                    >
                                        <img src={`${BASE_URL}${temple.images[0]}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Gallery 1" />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                    </div>
                                    {/* Small Grid on Right */}
                                    {temple.images.slice(1, 4).map((img, idx) => (
                                        <div
                                            key={idx}
                                            className={`rounded-2xl overflow-hidden cursor-pointer shadow-sm group relative border border-border-theme ${idx === 0 ? "col-span-2 row-span-1 md:col-span-1" : "col-span-1 row-span-1"
                                                }`}
                                            onClick={() => setSelectedImage(`${BASE_URL}${img}`)}
                                        >
                                            <img src={`${BASE_URL}${img}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={`Gallery ${idx + 2}`} />
                                        </div>
                                    ))}
                                    {temple.images.length > 4 && (
                                        <div
                                            className="rounded-2xl overflow-hidden cursor-pointer shadow-sm relative border border-border-theme bg-primary/90 flex flex-col items-center justify-center text-white col-span-1 row-span-1 group hover:bg-primary transition-all"
                                            onClick={() => setSelectedImage(`${BASE_URL}${temple.images[4]}`)}
                                        >
                                            {temple.images[4] && <img src={`${BASE_URL}${temple.images[4]}`} className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay group-hover:scale-110 transition-transform duration-700" alt="Gallery 5" />}
                                            <Search className="w-6 h-6 mb-2 drop-shadow-md relative z-10" />
                                            <span className="text-[11px] font-black uppercase tracking-widest relative z-10 drop-shadow-md">+{temple.images.length - 4} More</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-secondary-bg/20 border-2 border-dashed border-border-theme rounded-[2.5rem] h-48 flex items-center justify-center text-foreground/40 font-bold">
                                    No additional gallery images available.
                                </div>
                            )}
                        </section>

                        {/* How to Reach / Map */}
                        <section className="space-y-6 pt-6 border-t border-border-theme/50 pb-10">
                            <h2 className="text-2xl md:text-3xl font-black text-foreground flex items-center gap-3">
                                <span className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </span>
                                How to Reach
                            </h2>

                            <div className="relative w-full h-[380px] bg-secondary-bg border border-border-theme rounded-[2.5rem] overflow-hidden shadow-xl">
                                {coords.length > 0 ? (
                                    <MapContainer
                                        center={[coords[1], coords[0]]}
                                        zoom={15}
                                        style={{ height: '100%', width: '100%', zIndex: 10 }}
                                        scrollWheelZoom={false}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                        />
                                        <Marker position={[coords[1], coords[0]]}>
                                            <Popup>
                                                <div className="font-bold text-sm">{temple?.name}</div>
                                                <div className="text-xs text-gray-500">{temple?.district?.name}, Tamil Nadu</div>
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-foreground/30 font-bold text-sm">
                                        Location coordinates not available
                                    </div>
                                )}

                                {/* Overlay info card */}
                                <div className="absolute bottom-5 left-5 right-5 md:right-auto md:max-w-sm bg-background/95 backdrop-blur-xl border border-border-theme p-4 rounded-[1.5rem] shadow-2xl flex items-center justify-between gap-4 z-[500]">
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-lg shrink-0">
                                            <MapPin className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-foreground leading-tight text-sm">{temple?.name}</h4>
                                            <p className="text-[10px] font-semibold text-foreground/50 mt-0.5 uppercase tracking-wider">{temple?.district?.name}, Tamil Nadu</p>
                                            {coords.length > 0 && (
                                                <p className="text-[9px] font-bold text-foreground/30 mt-1 tracking-wider">
                                                    {coords[1].toFixed(5)}, {coords[0].toFixed(5)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {coords.length > 0 && (
                                        <button
                                            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${coords[1]},${coords[0]}`, '_blank')}
                                            className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl transition-all shadow-md shrink-0 active:scale-95"
                                        >
                                            Open In Maps
                                        </button>
                                    )}
                                </div>
                            </div>
                        </section>

                    </div>


                    {/* RIGHT SIDEBAR (4 COLS) */}
                    <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">

                        {/* Upcoming Festivals Card */}
                        <div className="bg-secondary-bg/20 border border-border-theme rounded-[2rem] overflow-hidden shadow-xl">
                            <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-5 flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-white" />
                                <h3 className="text-white font-black tracking-widest uppercase text-sm">Upcoming Festivals</h3>
                            </div>

                            <div className="p-6 space-y-5">
                                {temple?.festivals?.length > 0 ? temple.festivals.map(fest => (
                                    <div key={fest._id || fest.name} className="flex gap-4 items-start group border-b border-border-theme/40 pb-5 last:border-0 last:pb-0">
                                        <div className="w-14 h-16 bg-secondary-bg border border-border-theme rounded-xl flex flex-col items-center justify-center shrink-0 shadow-sm group-hover:border-primary/30 transition-colors">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Upcoming</span>
                                            <span className="text-xl font-black text-foreground leading-none">Soon</span>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-foreground leading-tight mb-1.5 group-hover:text-primary transition-colors">{fest.name}</h4>
                                            <p className="text-xs font-medium text-foreground/50 leading-relaxed line-clamp-2">A grand sacred celebration marking vital auspicious days in the calendar.</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-2">
                                        <div className="flex gap-4 items-start group border-b border-border-theme/40 pb-5">
                                            <div className="w-14 h-16 bg-secondary-bg border border-border-theme rounded-xl flex flex-col items-center justify-center shrink-0 shadow-sm">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Apr</span>
                                                <span className="text-2xl font-black text-foreground leading-none">14</span>
                                            </div>
                                            <div>
                                                <h4 className="font-black text-foreground leading-tight mb-1.5 line-clamp-1">Chithirai Festival</h4>
                                                <p className="text-xs font-medium text-foreground/50 leading-loose line-clamp-1">10-day celestial wedding celebration</p>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-orange-500 mt-2 flex items-center gap-1.5">
                                                    <AlertCircle className="w-3 h-3" /> Peak Crowd Expected
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 hover:text-foreground transition-colors border-t border-border-theme/60 pt-6 mt-2">
                                    Full Festival Calendar
                                </button>
                            </div>
                        </div>

                        {/* Nearby Temples Card */}
                        <div className="bg-secondary-bg/20 border border-border-theme rounded-[2rem] overflow-hidden shadow-xl mt-4">
                            <div className="p-6 border-b border-border-theme/40 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Navigation className="w-4 h-4 ml-0.5" />
                                </div>
                                <h3 className="text-foreground font-black tracking-widest uppercase text-xs">Nearby Temples</h3>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Mock Nearby Temples */}
                                {[
                                    { name: "Koodal Azhagar Temple", dist: "1.2 km away", img: "/placeholder-temple.jpg" },
                                    { name: "Thiruparankundram", dist: "8.4 km away", img: "/placeholder-temple.jpg" },
                                    { name: "Alagar Koyil", dist: "21 km away", img: "/placeholder-temple.jpg" },
                                ].map((nt, i) => (
                                    <div key={i} className="flex gap-4 items-center group cursor-pointer transition-all hover:bg-foreground/5 p-2 -mx-2 rounded-2xl">
                                        <img src={nt.img} className="w-14 h-14 rounded-xl object-cover border border-border-theme group-hover:border-primary/30" />
                                        <div className="flex-1">
                                            <h4 className="font-black text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">{nt.name}</h4>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-1 mt-1.5">
                                                <MapPin className="w-3 h-3 text-primary/70" /> {nt.dist}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                <button className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-primary/70 transition-colors pt-4 text-center">
                                    View City Map
                                </button>
                            </div>
                        </div>

                        {/* Plan Your Visit CTA */}
                        <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-[2rem] p-8 text-white shadow-2xl mt-4 relative overflow-hidden group">
                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700" />
                            <h3 className="text-2xl font-black mb-3 relative z-10">Plan Your Visit</h3>
                            <p className="text-white/80 font-medium text-sm leading-relaxed mb-8 relative z-10 pr-4">
                                Need a personal guide or specialized rituals? We offer curated experiences for devotees.
                            </p>
                            <button className="w-full bg-white text-orange-600 hover:bg-secondary-bg py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 relative z-10">
                                Contact Official Trust
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TempleDetail;
