import { Outlet } from "react-router-dom";

const ContributorLayout = () => {
  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5">
        <h2 className="text-xl font-bold mb-6">
          Contributor
        </h2>

        <ul className="space-y-3">
          <li>Dashboard</li>
          <li>Add Temple</li>
          <li>My Temples</li>
        </ul>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>

    </div>
  );
};

export default ContributorLayout;