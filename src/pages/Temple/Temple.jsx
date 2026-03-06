import { useState } from "react";
import AddTempleModal from "./AddTempleModal";
import TempleList from "./TempleList";

const Temple = () => {

  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">
          Temples
        </h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Temple
        </button>

      </div>

      {/* temple list */}
      <TempleList />

      <AddTempleModal
        isOpen={open}
        onClose={() => setOpen(false)}
      />

    </div>
  );
};

export default Temple;