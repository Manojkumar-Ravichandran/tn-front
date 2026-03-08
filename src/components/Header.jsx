import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Bell, Menu, X, LogIn, LogOut, ChevronDown, UserPlus } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import useUIStore from '../store/uiStore';
import useAuthStore from '../features/auth/authStore';
import ContributorRequestModal from '../pages/Contributor/ContributorRequestModal';

/* Public nav links — shown when NOT logged in */
const PUBLIC_NAV = [
    { label: 'Districts', to: '/districts' },
    { label: 'Deities', to: '/deities' },
    { label: 'Festivals', to: '/festivals' },
];

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isSidebarOpen, toggleSidebar } = useUIStore();
    const { user, logout } = useAuthStore();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const userMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
        navigate('/');
    };

    const isActive = (to) => location.pathname + location.search === to || location.pathname === to.split('?')[0];

    return (
        <>
            <header className="header-fixed bg-background/90 backdrop-blur-md border-b border-border-theme z-50 transition-all duration-300">
                <div className="flex items-center justify-between w-full h-16 px-4 md:px-8">

                    {/* LEFT — Logo */}
                    <div className="flex items-center gap-2 md:gap-3 min-w-[140px]">
                        {/* Mobile sidebar toggle (logged-in only) */}
                        {user && (
                            <button
                                onClick={toggleSidebar}
                                className="p-2 lg:hidden text-foreground hover:bg-secondary-bg rounded-lg transition-colors focus:outline-none"
                                aria-label="Toggle menu"
                            >
                                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        )}

                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0 shadow-md shadow-primary/20 group-hover:scale-105 transition-transform active:scale-95">
                                <span className="text-white font-black text-base leading-none">T</span>
                            </div>
                            <div className="hidden sm:block">
                                <span className="font-black text-base tracking-tight text-foreground block leading-none">TN Temples</span>
                                <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-[0.15em] leading-none">Heritage of Tamil Nadu</span>
                            </div>
                        </Link>
                    </div>

                    {/* CENTER — Nav links (always visible) */}
                    <nav className="hidden md:flex items-center gap-1">
                        {PUBLIC_NAV.map(({ label, to }) => {
                            const active = isActive(to);
                            return (
                                <Link
                                    key={label}
                                    to={to}
                                    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${active
                                        ? 'text-primary font-black'
                                        : 'text-foreground/60 hover:text-foreground hover:bg-secondary-bg/60'
                                        }`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* RIGHT — Actions */}
                    <div className="flex items-center gap-2 min-w-[140px] justify-end">
                        <ThemeToggle />

                        {/* Authenticated: bell */}
                        {user && (
                            <button className="p-2 text-foreground/60 hover:bg-secondary-bg rounded-full transition-colors relative group">
                                <Bell className="w-5 h-5 group-hover:text-primary transition-colors" />
                                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-orange-500 rounded-full border-2 border-background animate-pulse" />
                            </button>
                        )}

                        <div className="hidden sm:block h-7 w-px bg-border-theme opacity-50" />

                        {/* Public: Join as Contributor CTA */}
                        {!user && (
                            <button
                                onClick={() => setIsRequestModalOpen(true)}
                                className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wide transition-all hover:bg-primary/90 active:scale-95 shadow-md shadow-primary/20"
                            >
                                <UserPlus className="w-3.5 h-3.5" />
                                Join as Contributor
                            </button>
                        )}

                        {/* User avatar dropdown */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-1.5 p-1.5 hover:bg-secondary-bg rounded-xl transition-all group border border-transparent hover:border-border-theme active:scale-95"
                            >
                                <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                    <User className="w-4 h-4 text-primary" />
                                </div>
                                <ChevronDown className={`w-3.5 h-3.5 text-foreground/40 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-60 bg-background border border-border-theme rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200 z-[60] backdrop-blur-xl">
                                    <div className="px-4 py-3 border-b border-border-theme mb-2">
                                        <p className="text-[9px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-1">Identity</p>
                                        <p className="text-[13px] font-black text-foreground truncate leading-none">
                                            {user ? user.email : 'Public Explorer'}
                                        </p>
                                        <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest ${user ? 'bg-orange-500/10 text-orange-500' : 'bg-primary/10 text-primary'}`}>
                                            <div className={`w-1 h-1 rounded-full ${user ? 'bg-orange-500 animate-pulse' : 'bg-primary'}`} />
                                            {user ? 'CONTRIBUTOR' : 'GUEST USER'}
                                        </div>
                                    </div>

                                    {user ? (
                                        <div className="space-y-1">
                                            <Link
                                                to="/dashboard"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-foreground/60 hover:text-foreground hover:bg-secondary-bg rounded-xl transition-all group/link"
                                            >
                                                <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover/link:bg-orange-500 group-hover/link:text-white transition-all">
                                                    <Menu className="w-3.5 h-3.5" />
                                                </div>
                                                Portal Dashboard
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-red-500/60 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all group/link"
                                            >
                                                <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 group-hover/link:bg-red-500 group-hover/link:text-white transition-all">
                                                    <LogOut className="w-3.5 h-3.5" />
                                                </div>
                                                Sign Out
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <Link
                                                to="/login"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-primary hover:bg-primary/10 rounded-xl transition-all group/link"
                                            >
                                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover/link:bg-primary group-hover/link:text-white transition-all">
                                                    <LogIn className="w-3.5 h-3.5" />
                                                </div>
                                                Staff Login
                                            </Link>
                                            <button
                                                onClick={() => { setIsRequestModalOpen(true); setIsUserMenuOpen(false); }}
                                                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-foreground/60 hover:text-foreground hover:bg-secondary-bg rounded-xl transition-all group/link"
                                            >
                                                <div className="w-7 h-7 rounded-lg bg-secondary-bg flex items-center justify-center text-foreground group-hover/link:bg-primary group-hover/link:text-white transition-all">
                                                    <UserPlus className="w-3.5 h-3.5" />
                                                </div>
                                                Join as Contributor
                                            </button>
                                        </div>
                                    )}

                                    {/* Mobile nav links */}
                                    {!user && (
                                        <div className="mt-2 pt-2 border-t border-border-theme md:hidden space-y-1">
                                            {PUBLIC_NAV.map(({ label, to }) => (
                                                <Link
                                                    key={label}
                                                    to={to}
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="block px-3 py-2 text-sm font-bold text-foreground/60 hover:text-foreground hover:bg-secondary-bg rounded-xl transition-all"
                                                >
                                                    {label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <ContributorRequestModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
            />
        </>
    );
};

export default Header;
