import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div>

      {/* Navbar */}
      <nav className="bg-gray-900 text-white p-4">
        TN Temples
      </nav>

      {/* Page Content */}
      <main className="p-6">
        <Outlet />
      </main>

    </div>
  );
};

export default PublicLayout;