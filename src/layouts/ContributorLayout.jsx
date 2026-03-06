import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const ContributorLayout = () => {
    return (
        <div className="flex min-h-screen font-sans">
            {/* Horizontal Top Header */}
            <Header />

            {/* Vertical Sidebar */}
            <Sidebar />

            {/* Main Scrollable Content */}
            <main className="main-content main-content-sidebar flex flex-col w-full">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default ContributorLayout;
