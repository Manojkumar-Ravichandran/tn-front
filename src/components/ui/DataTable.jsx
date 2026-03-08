import { useState } from "react";
import {
  Search, Filter, ChevronLeft, ChevronRight,
  MoreVertical, Eye, Pencil, Trash2,
  RotateCcw, FileSearch
} from "lucide-react";
import TableSkeleton from "./TableSkeleton";

/**
 * A highly reusable and premium DataTable component.
 * Now fully supports Light/Dark modes using semantic Tailwind classes.
 */
const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  actions = null,
  searchable = true,
  filterNode = null,
  pagination = true,
  pageSize = 5,
  title = "Data Grid"
}) => {

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(Number(pageSize) || 5);

  // Initial Loading State
  if (loading) {
    const safeColsCount = (Array.isArray(columns) && columns.length > 0) ? columns.length : 4;
    return (
      <div className="bg-background border border-border-theme rounded-2xl md:rounded-3xl overflow-hidden min-h-[400px] shadow-xl transition-all duration-300">
        <div className="p-4 md:p-6 border-b border-border-theme">
          <div className="h-6 w-48 bg-secondary-bg animate-pulse rounded-lg bg-foreground/5"></div>
        </div>
        <TableSkeleton rows={Number(itemsPerPage) || 5} cols={safeColsCount} />
      </div>
    );
  }

  // Data Sanitization
  const safeData = Array.isArray(data) ? data : [];
  const safeColumns = Array.isArray(columns) ? columns : [];

  // Filter Logic
  const filteredData = safeData.filter((item) => {
    if (!item) return false;
    try {
      const query = search.toLowerCase();
      return Object.values(item).some(val =>
        String(val).toLowerCase().includes(query)
      );
    } catch (e) {
      return false;
    }
  });

  // Sort Logic
  if (sortKey && filteredData.length > 1) {
    try {
      filteredData.sort((a, b) => {
        const aVal = a?.[sortKey] ?? "";
        const bVal = b?.[sortKey] ?? "";
        return sortOrder === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
      });
    } catch (err) {
      console.error("DataTable Sort Error:", err);
    }
  }

  // Pagination Logic
  const totalItems = filteredData.length;
  const currentItemsPerPage = Number(itemsPerPage) || 5;
  const totalPages = Math.ceil(totalItems / currentItemsPerPage) || 0;
  const safePage = Math.min(Math.max(1, page), Math.max(1, totalPages));
  const startIdx = (safePage - 1) * currentItemsPerPage;
  const endIdx = startIdx + currentItemsPerPage;
  const paginatedData = pagination ? filteredData.slice(startIdx, endIdx) : filteredData;

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="bg-background text-foreground border border-border-theme rounded-2xl md:rounded-3xl overflow-hidden shadow-xl flex flex-col transition-all duration-500">

      {/* TOOLBAR */}
      <header className="p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-black tracking-tight">{title}</h2>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {searchable && (
            <div className="relative flex-1 sm:w-64 lg:w-80 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 group-focus-within:text-primary transition-colors" />
              <input
                placeholder="Search..."
                className="w-full bg-secondary-bg border border-border-theme focus:border-primary/30 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none transition-all placeholder:text-foreground/30"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          )}

          {filterNode ? filterNode : (
            <button className="flex items-center gap-2 bg-secondary-bg border border-border-theme px-4 py-2 rounded-xl text-sm font-bold text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all active:scale-[0.98]">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          )}
        </div>
      </header>

      {/* TABLE ENGINE */}
      <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-foreground/10">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead className="bg-secondary-bg/50 border-b border-border-theme">
            <tr>
              {safeColumns.map((col, idx) => (
                <th
                  key={col.key || `col-${idx}`}
                  className="px-4 py-3 text-[10px] md:text-[11px] font-black text-foreground/40 uppercase tracking-widest cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => col.dataIndex && handleSort(col.dataIndex)}
                >
                  <div className="flex items-center gap-2">
                    <span>{col.title || "Column"}</span>
                    {sortKey === col.dataIndex && (
                      <span className="text-[10px] text-primary">{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3 text-[10px] md:text-[11px] font-black text-foreground/40 uppercase tracking-widest text-right">
                  Options
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-border-theme">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr key={row?._id || `row-${rowIdx}`} className="hover:bg-foreground/[0.02] group/row transition-colors">
                  {safeColumns.map((col, colIdx) => (
                    <td key={col.key || `cell-${rowIdx}-${colIdx}`} className="px-4 py-3 md:py-4 align-middle">
                      {col.render ? (
                        col.render(row)
                      ) : (
                        <span className="text-foreground/80 text-sm font-medium">
                          {row[col.dataIndex] !== undefined ? String(row[col.dataIndex]) : "—"}
                        </span>
                      )}
                    </td>
                  ))}

                  {actions && (
                    <td className="px-4 py-3 md:py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-40 group-hover/row:opacity-100 transition-all">
                        {actions.map((action, i) => {
                          if (action.show && !action.show(row)) return null;
                          const IconComp = action.icon;
                          return (
                            <button
                              key={i}
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick && action.onClick(row);
                              }}
                              className={`p-2 rounded-lg transition-all ${action.className || "text-foreground/60 hover:text-foreground hover:bg-foreground/10"}`}
                              title={action.label}
                            >
                              {IconComp ? (
                                <IconComp className="w-[16px] h-[16px]" />
                              ) : (
                                <span className="text-xs px-2">{action.label}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={safeColumns.length + (actions ? 1 : 0)} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-20">
                    <FileSearch className="w-16 h-16" />
                    <p className="text-xl font-black tracking-tight">No records found</p>
                    <p className="text-xs max-w-xs leading-relaxed">Try adjusting your search or filters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER CONTROLS */}
      {pagination && paginatedData.length > 0 && (
        <footer className="p-4 md:p-6 border-t border-border-theme flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm font-bold text-foreground/40 flex items-center gap-4">
            <p>
              Showing <span className="text-foreground/80">{startIdx + 1}—{Math.min(endIdx, totalItems)}</span> of <span className="text-foreground/80">{totalItems}</span>
            </p>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest opacity-50">Limit</span>
              <select
                className="bg-secondary-bg border border-border-theme text-foreground/80 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-primary/20 transition-all font-bold cursor-pointer"
                value={currentItemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={safePage === 1}
              onClick={() => setPage(safePage - 1)}
              className="p-2 border border-border-theme rounded-xl disabled:opacity-20 disabled:cursor-not-allowed hover:bg-foreground/5 transition-all active:scale-90"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-black transition-all ${safePage === pageNum
                      ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                      : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              disabled={safePage === totalPages || totalPages === 0}
              onClick={() => setPage(safePage + 1)}
              className="p-2 border border-border-theme rounded-xl disabled:opacity-20 disabled:cursor-not-allowed hover:bg-foreground/5 transition-all active:scale-90"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default DataTable;
