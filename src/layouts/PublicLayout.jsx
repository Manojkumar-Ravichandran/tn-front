import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const PublicLayout = () => {
    return (
        <div className="min-h-screen">
            {/* Common Header */}
            <Header />

            {/* Main Content Area */}
            <main className="main-content">
                <div className="max-w-7xl mx-auto p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default PublicLayout;