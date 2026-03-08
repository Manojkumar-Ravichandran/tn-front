import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Filter } from 'lucide-react';
import { getFestivals } from '../../features/temples/masterApi';
import { getPublicTemples } from '../../features/temples/templeApi';
import SEO from '../../components/SEO';

/* ─── Helpers ─── */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Deterministically assign a day-of-month (1–28) to each festival by name hash
const hashDay = (str) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffffffff;
    return Math.abs(h % 28) + 1;
};

// Pastel event colours (cycling)
const EVENT_COLORS = [
    'bg-orange-100 text-orange-700 border-orange-200',
    'bg-green-100 text-green-700 border-green-200',
    'bg-purple-100 text-purple-700 border-purple-200',
    'bg-blue-100 text-blue-700 border-blue-200',
    'bg-rose-100 text-rose-700 border-rose-200',
    'bg-amber-100 text-amber-700 border-amber-200',
];

/* ─── Build calendar grid ─── */
const buildCalendar = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
};

/* ═══════════════════════════════════════ */
const Festivals = () => {
    const today = new Date();
    const [viewDate, setViewDate] = useState({ year: today.getFullYear(), month: today.getMonth() });
    const [email, setEmail] = useState('');

    const { data: festivals = [], isLoading: loadingFests } = useQuery({ queryKey: ['festivals'], queryFn: getFestivals });
    const { data: temples = [], isLoading: loadingTemples } = useQuery({ queryKey: ['public-temples'], queryFn: getPublicTemples });

    const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api/v1', '');

    const prevMonth = () => setViewDate(({ year, month }) =>
        month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }
    );
    const nextMonth = () => setViewDate(({ year, month }) =>
        month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }
    );

    // Assign each festival a day so we can render it on the calendar
    const festivalMap = {}; // day → [festivals]
    festivals.forEach((f, idx) => {
        const day = hashDay(f.name);
        if (!festivalMap[day]) festivalMap[day] = [];
        festivalMap[day].push({ ...f, color: EVENT_COLORS[idx % EVENT_COLORS.length] });
    });

    const cells = buildCalendar(viewDate.year, viewDate.month);
    const isToday = (d) => d === today.getDate() && viewDate.month === today.getMonth() && viewDate.year === today.getFullYear();

    // Featured = first 4 festivals with a paired temple image
    const featured = festivals.slice(0, 4).map((f, i) => ({
        ...f,
        temple: temples[i % (temples.length || 1)],
        color: EVENT_COLORS[i % EVENT_COLORS.length],
    }));

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Spiritual Calendar — Tamil Nadu Temple Festivals"
                description="Discover sacred temple festivals and divine celebrations across Tamil Nadu. Browse the spiritual calendar and never miss an important festival event."
                keywords="Tamil Nadu festivals, temple festivals, Panguni Uthiram, Chithirai, Aadi Perukku, Hindu festivals, sacred events"
                canonical="/festivals"
            />

            {/* ── BREADCRUMB + HEADER ── */}
            <div className="pt-24 pb-0 container mx-auto px-6 max-w-7xl">
                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-6">
                    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                    <span>/</span>
                    <span className="text-foreground/70">Spiritual Calendar</span>
                </nav>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight mb-2">
                            Spiritual <span className="text-primary italic">Calendar</span>
                        </h1>
                        <p className="text-foreground/40 font-medium">
                            Discover sacred moments and divine celebrations across Tamil Nadu.
                        </p>
                    </div>

                    {/* Mini controls */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2 bg-secondary-bg border border-border-theme rounded-2xl px-4 py-2.5">
                            <Filter className="w-3.5 h-3.5 text-foreground/40" />
                            <span className="text-xs font-bold text-foreground/50">All Districts</span>
                            <ChevronRight className="w-3.5 h-3.5 text-foreground/30 rotate-90" />
                        </div>
                        <div className="flex items-center gap-2 bg-secondary-bg border border-border-theme rounded-2xl px-4 py-2.5 min-w-[180px]">
                            <span className="text-xs font-medium text-foreground/30 flex-1">Filter by Temple Name...</span>
                        </div>
                        <button className="px-5 py-2.5 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all active:scale-95 shadow-md shadow-primary/20">
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* ── CALENDAR ── */}
            <div className="container mx-auto px-6 max-w-7xl mb-16">
                <div className="bg-background border border-border-theme rounded-[2rem] overflow-hidden shadow-xl">

                    {/* Calendar toolbar */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border-theme bg-secondary-bg/30">
                        <button onClick={prevMonth} className="p-2 hover:bg-secondary-bg rounded-xl transition-all active:scale-95">
                            <ChevronLeft className="w-5 h-5 text-foreground/60" />
                        </button>
                        <h2 className="text-lg font-black text-foreground tracking-tight">
                            {MONTHS[viewDate.month]} {viewDate.year}
                        </h2>
                        <button onClick={nextMonth} className="p-2 hover:bg-secondary-bg rounded-xl transition-all active:scale-95">
                            <ChevronRight className="w-5 h-5 text-foreground/60" />
                        </button>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 border-b border-border-theme">
                        {DAYS.map(d => (
                            <div key={d} className="py-3 text-center text-[10px] font-black uppercase tracking-widest text-foreground/30">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7">
                        {cells.map((day, idx) => (
                            <div
                                key={idx}
                                className={`min-h-[90px] p-1.5 border-b border-r border-border-theme/50 transition-colors ${day ? 'hover:bg-secondary-bg/30' : 'bg-secondary-bg/10'
                                    } ${idx % 7 === 6 ? 'border-r-0' : ''}`}
                            >
                                {day && (
                                    <>
                                        <span className={`text-xs font-black w-6 h-6 flex items-center justify-center rounded-full mb-1 ${isToday(day)
                                            ? 'bg-primary text-white shadow-md shadow-primary/30'
                                            : 'text-foreground/50'
                                            }`}>
                                            {day}
                                        </span>
                                        {/* Festival events */}
                                        {(festivalMap[day] || []).slice(0, 2).map((f, i) => (
                                            <div
                                                key={i}
                                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border truncate mb-0.5 leading-tight ${f.color}`}
                                                title={f.name}
                                            >
                                                {f.name}
                                            </div>
                                        ))}
                                        {(festivalMap[day] || []).length > 2 && (
                                            <span className="text-[9px] font-black text-foreground/30 pl-1">
                                                +{festivalMap[day].length - 2} more
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── FEATURED FESTIVALS ── */}
            <div className="container mx-auto px-6 max-w-7xl mb-20">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Sub-Events</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight mb-8">
                    Featured Upcoming Festivals
                </h2>

                {loadingFests ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map(i => <div key={i} className="h-48 bg-secondary-bg animate-pulse rounded-3xl" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {featured.map((fest, i) => {
                            const temple = fest.temple;
                            const imgUrl = temple?.images?.[0] ? `${BASE_URL}${temple.images[0]}` : null;

                            return (
                                <div key={fest._id} className="group relative bg-background border border-border-theme rounded-[2rem] overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                                    <div className="flex gap-0">
                                        {/* Image */}
                                        <div className="relative w-44 md:w-52 shrink-0">
                                            {imgUrl ? (
                                                <img src={imgUrl} alt={fest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center min-h-[180px]">
                                                    <Calendar className="w-12 h-12 text-orange-400" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/30" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 p-6 flex flex-col justify-between">
                                            {/* Date badge */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${EVENT_COLORS[i % EVENT_COLORS.length]}`}>
                                                    {MONTHS[viewDate.month].slice(0, 3)} {hashDay(fest.name)}, {viewDate.year}
                                                </span>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-black text-foreground leading-tight mb-2 group-hover:text-primary transition-colors">
                                                    {fest.name}
                                                </h3>
                                                {temple && (
                                                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-foreground/40 mb-1">
                                                        <MapPin className="w-3 h-3 text-primary/60" />
                                                        {temple.district?.name ? `${temple.district.name}, Tamil Nadu` : 'Tamil Nadu'}
                                                    </div>
                                                )}
                                                <p className="text-xs text-foreground/40 leading-relaxed mt-2 line-clamp-2">
                                                    A grand celebration of the heritage of this sacred festival, witnessed at Tamil Nadu temple across the state.
                                                </p>
                                            </div>

                                            {temple && (
                                                <Link
                                                    to={`/temples/${temple.slug}`}
                                                    className="mt-4 self-start inline-flex items-center gap-2 bg-foreground text-background text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl hover:bg-primary hover:text-white transition-all active:scale-95"
                                                >
                                                    Know Temple Details
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── CTA SUBSCRIPTION BANNER ── */}
            <div className="mx-6 mb-16 max-w-7xl md:mx-auto">
                <div className="relative bg-primary rounded-[2.5rem] p-10 md:p-14 overflow-hidden">
                    {/* Decorative blobs */}
                    <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-16 items-start md:items-center justify-between">
                        <div className="max-w-md">
                            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3">
                                Never Miss a Sacred Event
                            </h2>
                            <p className="text-white/70 font-medium text-sm leading-relaxed">
                                Subscribe to get monthly festival alerts and divine insights directly in your inbox.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:min-w-[420px]">
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="flex-1 bg-white text-foreground text-sm font-medium px-5 py-4 rounded-2xl outline-none placeholder:text-foreground/30 shadow-xl"
                            />
                            <button className="px-7 py-4 bg-foreground text-background text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-background/90 transition-all active:scale-95 shadow-xl whitespace-nowrap">
                                Notify Me
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── FOOTER ── */}
            <footer className="border-t border-border-theme bg-secondary-bg/20 pt-14 pb-8">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

                        {/* Brand */}
                        <div className="md:col-span-1">
                            <Link to="/" className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                    <span className="text-white font-black text-base">T</span>
                                </div>
                                <span className="font-black text-base text-foreground">Tamil Nadu Temples</span>
                            </Link>
                            <p className="text-xs font-medium text-foreground/40 leading-relaxed max-w-xs">
                                Documenting and preserving the architectural heritage and cultural traditions of Tamil Nadu's ancient temple civilization.
                            </p>
                        </div>

                        {/* Explore */}
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 mb-4">Explore</h4>
                            <ul className="space-y-3">
                                {['All Temples', 'Districts', 'Deities', 'Festivals'].map(l => (
                                    <li key={l}>
                                        <Link to="/festivals" className="text-sm font-medium text-foreground/50 hover:text-primary transition-colors">
                                            {l}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* About */}
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 mb-4">About</h4>
                            <ul className="space-y-3">
                                {['Our Mission', 'Contributors', 'Admin Portal', 'Privacy Policy'].map(l => (
                                    <li key={l}>
                                        <Link to="/login" className="text-sm font-medium text-foreground/50 hover:text-primary transition-colors">
                                            {l}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Join */}
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 mb-4">Contribute</h4>
                            <p className="text-xs font-medium text-foreground/40 leading-relaxed mb-4">
                                Help document and verify temple data for future generations.
                            </p>
                            <Link to="/login" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all">
                                Join as Contributor
                            </Link>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="border-t border-border-theme pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-bold text-foreground/25 uppercase tracking-widest">
                        <span>© {today.getFullYear()} Tamil Nadu Temples. All rights reserved.</span>
                        <div className="flex items-center gap-6">
                            <Link to="/" className="hover:text-foreground/60 transition-colors">Privacy</Link>
                            <Link to="/" className="hover:text-foreground/60 transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Festivals;
