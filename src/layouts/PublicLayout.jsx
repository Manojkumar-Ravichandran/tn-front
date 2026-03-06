import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const PublicLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Common Header */}
            <Header />

            {/* Main Content Area */}
            <main className="main-content flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default PublicLayout;