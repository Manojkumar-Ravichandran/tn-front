import React from 'react';
import { Link } from 'react-router-dom';
import { User, Bell, Search } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header = () => {
    return (
        <header className="header-fixed bg-background border-border-theme">
            <div className="flex items-center justify-between w-full">
                {/* Logo / Brand */}
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">T</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-foreground">
                            TN Temples
                        </span>
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <button className="p-2 text-foreground/60 hover:bg-secondary-bg rounded-full transition-colors">
                        <Search className="w-5 h-5" />
                    </button>

                    <ThemeToggle />

                    <button className="p-2 text-foreground/60 hover:bg-secondary-bg rounded-full transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
                    </button>

                    <div className="h-8 w-[1px] bg-border-theme mx-1"></div>

                    <button className="flex items-center gap-2 p-1 pl-2 hover:bg-secondary-bg rounded-full transition-colors">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-foreground mr-2">Admin</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
