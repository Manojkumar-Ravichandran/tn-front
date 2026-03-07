import { useState } from "react";
import { Plus } from "lucide-react";
import TempleList from "./TempleList";
import AddTempleModal from "./AddTempleModal";

/**
 * Main Temple Page
 * Fully responsive and theme-aware.
 */
const Temple = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col w-full pb-10">
      {/* COMPACT & RESPONSIVE HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 md:mb-10">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
            Temple Submissions
          </h1>
          <p className="text-foreground/40 text-xs md:text-sm font-bold uppercase tracking-[0.1em]">
            {/* Hidden on very small screens to save space if needed */}
            Manage your temple catalog and rewards
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-2xl font-black text-xs md:text-sm transition-all shadow-lg shadow-primary/20 active:scale-95 shrink-0 border border-white/10"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5 stroke-[3]" />
          Add New Temple
        </button>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="w-full">
        <TempleList />
      </main>

      {/* FORM MODAL */}
      <AddTempleModal
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

export default Temple;