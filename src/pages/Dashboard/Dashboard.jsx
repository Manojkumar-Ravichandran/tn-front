import React from 'react';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-0">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
        Contributor Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-background border border-border-theme p-5 md:p-6 rounded-2xl shadow-sm transition-all hover:shadow-md">
          <h3 className="text-foreground/60 text-xs md:text-sm font-medium uppercase tracking-wider">Total Submissions</h3>
          <p className="text-3xl md:text-4xl font-bold text-foreground mt-2">0</p>
        </div>
        <div className="bg-background border border-border-theme p-5 md:p-6 rounded-2xl shadow-sm transition-all hover:shadow-md">
          <h3 className="text-foreground/60 text-xs md:text-sm font-medium uppercase tracking-wider">Approved</h3>
          <p className="text-3xl md:text-4xl font-bold text-foreground mt-2 text-green-600 dark:text-green-500">0</p>
        </div>
        <div className="bg-background border border-border-theme p-5 md:p-6 rounded-2xl shadow-sm transition-all hover:shadow-md sm:col-span-2 lg:col-span-1">
          <h3 className="text-foreground/60 text-xs md:text-sm font-medium uppercase tracking-wider">Pending Review</h3>
          <p className="text-3xl md:text-4xl font-bold text-foreground mt-2 text-orange-500">0</p>
        </div>
      </div>

      {/* Placeholder for Recent Activity */}
      <div className="mt-8 md:mt-12 bg-background border border-border-theme p-6 md:p-8 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
        <div className="py-12 flex flex-col items-center justify-center text-foreground/40 italic text-center">
          <p className="text-sm md:text-base">No recent activity to show.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;