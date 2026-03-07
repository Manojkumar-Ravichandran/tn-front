import React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

const ThemeToggle = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="w-10 h-10" />;

    const toggleTheme = () => {
        if (theme === "light") setTheme("dark");
        else if (theme === "dark") setTheme("system");
        else setTheme("light");
    };

    const getIcon = () => {
        if (theme === "system") return <Monitor className="w-5 h-5 text-slate-500 shadow-sm" />;
        if (theme === "light") return <Sun className="w-5 h-5 text-[#ec7f13] drop-shadow-sm" />;
        if (theme === "dark") return <Moon className="w-5 h-5 text-blue-400 drop-shadow-sm" />;

        // Fallback to resolved theme icon if somehow theme is undefined
        return resolvedTheme === "dark" ? <Moon /> : <Sun />;
    };

    return (
        <button
            onClick={toggleTheme}
            className={`
        p-2.5 rounded-full transition-all duration-300 flex items-center justify-center shadow-sm border
        bg-background border-border-theme hover:bg-secondary-bg text-foreground
        hover:scale-105 active:scale-95
      `}
            title={`Theme Setting: ${(theme || "system").charAt(0).toUpperCase() + (theme || "system").slice(1)} (Matches: ${resolvedTheme})`}
            aria-label="Toggle theme"
        >
            {getIcon()}
        </button>
    );
};

export default ThemeToggle;
