import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const PublicLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Common Header */}
            <Header />

            {/* Main Content Area - pages manage their own widths */}
            <main className="main-content flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default PublicLayout;