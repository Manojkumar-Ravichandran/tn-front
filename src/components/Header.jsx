import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Bell, Menu, X, LogIn, LogOut, ChevronDown, UserPlus } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import useUIStore from '../store/uiStore';
import useAuthStore from '../features/auth/authStore';
import ContributorRequestModal from '../pages/Contributor/ContributorRequestModal';

const Header = () => {
    const navigate = useNavigate();
    const { isSidebarOpen, toggleSidebar } = useUIStore();
    const { user, logout } = useAuthStore();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const userMenuRef = useRef(null);

    // Close menu when clicking outside
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

    return (
        <>
            <header className="header-fixed bg-background/80 backdrop-blur-md border-b border-border-theme z-50 transition-all duration-300">
                <div className="flex items-center justify-between w-full h-16 px-4 md:px-6">
                    {/* Logo / Brand */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Mobile/Tablet Menu Toggle */}
                        {user && (
                            <button
                                onClick={toggleSidebar}
                                className="p-2 lg:hidden text-foreground hover:bg-secondary-bg rounded-lg transition-colors focus:outline-none"
                                aria-label="Toggle menu"
                            >
                                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        )}

                        <Link to="/" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform active:scale-95 duration-300">
                                <span className="text-white font-black text-xl">T</span>
                            </div>
                            <span className="font-bold text-lg md:text-xl tracking-tight text-foreground whitespace-nowrap hidden min-[380px]:block">
                                TN Temples
                            </span>
                        </Link>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 md:gap-4">

                        {/* Public: Join as Contributor */}
                        {!user && (
                            <button
                                onClick={() => setIsRequestModalOpen(true)}
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 group"
                            >
                                <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Join as Contributor
                            </button>
                        )}

                        <ThemeToggle />

                        {/* Authenticated Only: Notifications */}
                        {user && (
                            <button className="p-2 text-foreground/60 hover:bg-secondary-bg rounded-full transition-colors relative group">
                                <Bell className="w-5 h-5 group-hover:text-primary transition-colors" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-background animate-pulse"></span>
                            </button>
                        )}

                        <div className="hidden sm:block h-8 w-[1px] bg-border-theme mx-1 opacity-50"></div>

                        {/* User Profile / Menu */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-2 p-1.5 hover:bg-secondary-bg rounded-2xl transition-all group border border-transparent hover:border-border-theme bg-background/40 active:scale-95"
                            >
                                <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center overflow-hidden shrink-0 group-hover:bg-primary/20 transition-colors">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                                <span className="hidden md:block text-sm font-bold text-foreground mr-1 whitespace-nowrap">
                                    {user ? user.name || user.username : 'Guest'}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-foreground/40 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Popup */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-3 w-64 bg-background border border-border-theme rounded-2.5xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200 z-[60] backdrop-blur-xl">
                                    <div className="px-4 py-4 border-b border-border-theme mb-2">
                                        <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-1.5">Identity Status</p>
                                        <p className="text-[13px] font-black text-foreground truncate leading-none">
                                            {user ? user.email : 'Public Explorer'}
                                        </p>
                                        <div className={`inline-flex items-center gap-1.5 mt-2.5 px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest ${user ? 'bg-orange-500/10 text-orange-500' : 'bg-primary/10 text-primary'}`}>
                                            <div className={`w-1 h-1 rounded-full ${user ? 'bg-orange-500 animate-pulse' : 'bg-primary'}`} />
                                            {user ? 'CONTRIBUTOR' : 'GUEST USER'}
                                        </div>
                                    </div>

                                    {user ? (
                                        <div className="space-y-1">
                                            <Link
                                                to="/dashboard"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-foreground/60 hover:text-foreground hover:bg-secondary-bg rounded-xl transition-all group/link"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover/link:bg-orange-500 group-hover/link:text-white transition-all">
                                                    <Menu className="w-4 h-4" />
                                                </div>
                                                Portal Dashboard
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-red-500/60 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all group/link mt-1"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 group-hover/link:bg-red-500 group-hover/link:text-white transition-all">
                                                    <LogOut className="w-4 h-4" />
                                                </div>
                                                Termination Session
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="p-1 space-y-1">
                                            <Link
                                                to="/login"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-primary hover:bg-primary/10 rounded-xl transition-all group/link"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover/link:bg-primary group-hover/link:text-white transition-all">
                                                    <LogIn className="w-4 h-4" />
                                                </div>
                                                Internal Access
                                            </Link>
                                            <button
                                                onClick={() => { setIsRequestModalOpen(true); setIsUserMenuOpen(false); }}
                                                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-foreground/60 hover:text-foreground hover:bg-secondary-bg rounded-xl transition-all group/link"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-secondary-bg flex items-center justify-center text-foreground group-hover/link:bg-primary group-hover/link:text-white transition-all">
                                                    <UserPlus className="w-4 h-4" />
                                                </div>
                                                Join Initiative
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Initiative Application Modal */}
            <ContributorRequestModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
            />
        </>
    );
};

export default Header;
