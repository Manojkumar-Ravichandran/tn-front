import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Castle,
    Calendar,
    User,
    FileText
} from "lucide-react";
import useUIStore from "../store/uiStore";

/**
 * Sidebar component that adapts its colors and visibility based on theme and screen size.
 */
const Sidebar = () => {
    const { isSidebarOpen, closeSidebar } = useUIStore();

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { name: "Temples", icon: Castle, path: "/temples" },
        { name: "Festivals", icon: Calendar, path: "/festivals" },
        { name: "Profile", icon: User, path: "/profile" },
        { name: "Report", icon: FileText, path: "/report" },
        { name: "Masters", icon: FileText, path: "/masters" },
        { name: "Contributor", icon: User, path: "/contributor" },
    ];

    return (
        <>
            {/* Mobile/Tablet Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm transition-opacity duration-300"
                    onClick={closeSidebar}
                />
            )}

            <aside className={`sidebar-fixed flex flex-col items-center py-4 shadow-sm ${isSidebarOpen ? 'is-open' : ''}`}>
                <div className="flex flex-col w-full">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={() => {
                                // Close sidebar on mobile/tablet after clicking an item
                                if (window.innerWidth < 1024) closeSidebar();
                            }}
                            className={({ isActive }) =>
                                `flex flex-col items-center justify-center py-5 px-1 text-center transition-all duration-300 relative group overflow-hidden ${isActive
                                    ? "text-primary bg-primary/10"
                                    : "text-foreground/50 hover:text-primary hover:bg-secondary-bg"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className={`w-5 h-5 mb-2 transition-transform duration-300 group-hover:scale-110 ${isActive ? "stroke-[2.5]" : "stroke-[1.5]"
                                        }`} />
                                    <span className={`text-[10px] font-medium leading-tight px-1 overflow-hidden text-ellipsis whitespace-nowrap w-full ${isActive ? "font-bold" : ""
                                        }`}>
                                        {item.name}
                                    </span>

                                    {/* Active Indicator Bar */}
                                    <div
                                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full transition-transform duration-300 origin-left ${isActive ? "scale-x-100" : "scale-x-0"
                                            }`}
                                    />
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
