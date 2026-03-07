/**
 * A theme-aware loading skeleton for the DataTable.
 * Matches the updated padding and semantic colors.
 */
const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="bg-background flex flex-col p-0 rounded-b-2xl md:rounded-b-3xl overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 md:gap-6 px-4 py-3 md:py-4 border-t border-border-theme animate-pulse"
        >
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className={`h-3 md:h-4 bg-foreground/5 rounded-lg w-full ${j === 0 ? 'w-2/3 h-5 md:h-6' : ''}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;