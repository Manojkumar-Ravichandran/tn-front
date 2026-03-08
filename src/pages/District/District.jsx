import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, ChevronLeft, ChevronRight, ArrowRight, Search, ImageOff } from 'lucide-react';
import { getDistricts } from '../../features/temples/masterApi';
import { getTemplesByDistrict } from '../../features/temples/templeApi';
import SEO from '../../components/SEO';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api/v1', '');

/* ─── District pill card (horizontal scroll) ─── */
const DistrictPill = ({ district, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-shrink-0 flex items-center gap-2.5 px-5 py-3 rounded-2xl border text-sm font-bold transition-all duration-200 active:scale-95 whitespace-nowrap ${isActive
            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-[1.03]'
            : 'bg-background text-foreground/60 border-border-theme hover:border-primary/40 hover:text-foreground hover:bg-secondary-bg/40'
            }`}
    >
        <MapPin className={`w-4 h-4 ${isActive ? 'text-white' : 'text-primary/60'}`} />
        {district.name}
    </button>
);

/* ─── Temple card ─── */
const TempleCard = ({ temple, index }) => {
    const img = temple.images?.[0] ? `${BASE_URL}${temple.images[0]}` : null;
    return (
        <Link
            to={`/temples/${temple.slug}`}
            className="group relative bg-background border border-border-theme rounded-[1.75rem] overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 active:scale-[0.98]"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Image */}
            <div className="relative h-44 overflow-hidden bg-secondary-bg">
                {img ? (
                    <img
                        src={img}
                        alt={temple.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ImageOff className="w-10 h-10 text-foreground/20" />
                    </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                {/* Deity badge */}
                {temple.deity?.name && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-foreground text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow">
                        {temple.deity.name}
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="p-5">
                <h3 className="font-black text-foreground text-base leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {temple.name}
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground/40">
                    <MapPin className="w-3 h-3 text-primary/60" />
                    {temple.district?.name || 'Tamil Nadu'}
                </div>
            </div>

            {/* CTA arrow */}
            <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                    <ArrowRight className="w-4 h-4 text-white" />
                </div>
            </div>
        </Link>
    );
};

/* ─── Skeleton ─── */
const SkeletonCard = () => (
    <div className="bg-secondary-bg/40 border border-border-theme rounded-[1.75rem] overflow-hidden animate-pulse">
        <div className="h-44 bg-secondary-bg" />
        <div className="p-5 space-y-2.5">
            <div className="h-4 bg-secondary-bg rounded-lg w-3/4" />
            <div className="h-3 bg-secondary-bg rounded-lg w-1/2" />
        </div>
    </div>
);

/* ═══════════════════════════════════════ */
const District = () => {
    const scrollRef = useRef(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [search, setSearch] = useState('');

    const { data: districts = [], isLoading: loadingDistricts } = useQuery({
        queryKey: ['districts'],
        queryFn: getDistricts,
        onSuccess: (data) => {
            if (data.length > 0 && !selectedDistrict) setSelectedDistrict(data[0]);
        }
    });

    // Set default when districts load
    const effectiveDistrict = selectedDistrict || (districts.length > 0 ? districts[0] : null);

    const { data: temples = [], isLoading: loadingTemples } = useQuery({
        queryKey: ['temples-by-district', effectiveDistrict?._id],
        queryFn: () => getTemplesByDistrict(effectiveDistrict?._id),
        enabled: !!effectiveDistrict,
    });

    const filteredTemples = search.trim()
        ? temples.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
        : temples;

    const scroll = (dir) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Explore Temples by District — Tamil Nadu"
                description="Browse Hindu temples district-by-district across Tamil Nadu. Discover ancient sacred sites and spiritual heritage in every district of Tamil Nadu."
                keywords="Tamil Nadu districts, temple by district, Chennai temples, Madurai temples, Thanjavur temples, Coimbatore temples"
                canonical="/districts"
            />

            {/* ── HERO ── */}
            <section className="pt-24 pb-8">
                <div className="container mx-auto px-6 max-w-7xl">
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-6">
                        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-foreground/70">Districts</span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between mb-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight mb-2">
                                Explore by <span className="text-primary italic">District</span>
                            </h1>
                            <p className="text-foreground/40 font-medium">
                                Select a district to discover its temples and spiritual heritage.
                            </p>
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-72 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 group-focus-within:text-primary transition-colors" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search temples..."
                                className="w-full bg-secondary-bg border border-border-theme focus:border-primary/40 pl-11 pr-4 py-3 rounded-2xl text-sm focus:outline-none transition-all placeholder:text-foreground/25 font-medium"
                            />
                        </div>
                    </div>

                    {/* ── DISTRICT HORIZONTAL SCROLL ── */}
                    <div className="relative mb-10">
                        {/* Left arrow */}
                        <button
                            onClick={() => scroll(-1)}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 bg-background border border-border-theme rounded-full shadow-lg flex items-center justify-center hover:bg-secondary-bg transition-all active:scale-95"
                        >
                            <ChevronLeft className="w-4 h-4 text-foreground/60" />
                        </button>

                        {/* Scrollable strip */}
                        <div
                            ref={scrollRef}
                            className="flex items-center gap-3 overflow-x-auto scrollbar-hide scroll-smooth px-4 py-2"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {loadingDistricts
                                ? Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="flex-shrink-0 h-11 w-32 bg-secondary-bg animate-pulse rounded-2xl" />
                                ))
                                : districts.map(d => (
                                    <DistrictPill
                                        key={d._id}
                                        district={d}
                                        isActive={effectiveDistrict?._id === d._id}
                                        onClick={() => { setSelectedDistrict(d); setSearch(''); }}
                                    />
                                ))
                            }
                        </div>

                        {/* Right arrow */}
                        <button
                            onClick={() => scroll(1)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 bg-background border border-border-theme rounded-full shadow-lg flex items-center justify-center hover:bg-secondary-bg transition-all active:scale-95"
                        >
                            <ChevronRight className="w-4 h-4 text-foreground/60" />
                        </button>
                    </div>
                </div>
            </section>

            {/* ── TEMPLES GRID ── */}
            <section className="pb-20">
                <div className="container mx-auto px-6 max-w-7xl">

                    {/* Section header */}
                    {effectiveDistrict && (
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                            <h2 className="text-lg font-black text-foreground">
                                Temples in{' '}
                                <span className="text-primary">{effectiveDistrict.name}</span>
                            </h2>
                            {!loadingTemples && (
                                <span className="text-xs font-bold text-foreground/30 uppercase tracking-widest ml-1">
                                    — {filteredTemples.length} found
                                </span>
                            )}
                        </div>
                    )}

                    {/* Grid */}
                    {loadingTemples ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : filteredTemples.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
                            {filteredTemples.map((temple, i) => (
                                <TempleCard key={temple._id} temple={temple} index={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center border-2 border-dashed border-border-theme rounded-[2.5rem] bg-secondary-bg/10">
                            <MapPin className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                            <p className="text-lg font-black text-foreground/30">
                                {search ? `No temples found for "${search}"` : `No approved temples in ${effectiveDistrict?.name} yet`}
                            </p>
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="mt-4 text-xs font-black uppercase tracking-widest text-primary hover:underline"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default District;