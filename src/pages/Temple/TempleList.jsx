import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyTemples, getAdminTemples, approveTemple, rejectTemple } from "../../features/temples/templeApi";
import DataTable from "../../components/ui/DataTable";
import ImagePreview from "../../components/ui/ImagePreview";
import { MapPin, Eye, Pencil, Trash2, CheckCircle, XCircle, Filter } from "lucide-react";
import useAuthStore from "../../features/auth/authStore";
import toast from "react-hot-toast";
import TemplePreviewModal from "./TemplePreviewModal";

/**
 * Renders the table of user submissions.
 * Updated for the new theme-aware DataTable and reduced spacing.
 */
const TempleList = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "Admin";
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("pending");
  const [previewTemple, setPreviewTemple] = useState(null);

  // API State
  const {
    data: temples = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ["temples", isAdmin, statusFilter],
    queryFn: () => (isAdmin ? getAdminTemples(statusFilter) : getMyTemples())
  });

  const displayTemples = isAdmin
    ? temples
    : temples.filter(t => statusFilter === "all" || t.status === statusFilter);

  const approveMutation = useMutation({
    mutationFn: approveTemple,
    onSuccess: () => {
      toast.success("Temple approved successfully");
      queryClient.invalidateQueries({ queryKey: ["temples"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to approve temple");
    }
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => rejectTemple(id, reason),
    onSuccess: () => {
      toast.success("Temple rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["temples"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to reject temple");
    }
  });

  // Error State
  if (isError) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 p-12 rounded-2xl text-center">
        <p className="text-red-400 text-lg font-bold">Could not load temples.</p>
        <p className="text-red-500/60 text-sm mt-1">Please check your connection and try refreshing.</p>
      </div>
    );
  }

  // Column Configuration
  const columns = [
    {
      key: "name",
      title: "Temple Name",
      render: (row) => (
        <div
          className="flex items-center gap-3 group/item cursor-pointer"
          onClick={() => setPreviewTemple(row)}
        >
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden bg-secondary-bg border border-border-theme shrink-0 shadow-sm group-hover/item:border-primary/20 transition-all">
            <ImagePreview src={row?.images?.[0]} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-foreground font-bold text-[14px] leading-tight group-hover/item:text-primary transition-colors tracking-tight line-clamp-1">
              {row?.name || "Unnamed Temple"}
            </span>
            <div className="flex items-center gap-1.5 text-foreground/40 text-[10px] font-bold uppercase tracking-wider mt-0.5">
              <MapPin className="w-2.5 h-2.5 text-foreground/30" />
              <span className="truncate max-w-[120px] md:max-w-none">{row?.district?.name || "Tamil Nadu"}</span>
            </div>
          </div>
        </div>
      )
    },

    {
      key: "date",
      title: "Submitted On",
      render: (row) => (
        <span className="text-foreground/50 text-xs font-medium">
          {row?.createdAt ? new Date(row.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }) : '—'}
        </span>
      )
    },

    {
      key: "status",
      title: "Status",
      render: (row) => {
        const rawStatus = String(row?.status || 'pending').toLowerCase();
        const colors = {
          approved: { bg: "bg-green-500/10", text: "text-green-500", dot: "bg-green-500", label: "APPROVED" },
          pending: { bg: "bg-orange-500/10", text: "text-orange-500", dot: "bg-orange-500", label: "PENDING" },
          rejected: { bg: "bg-red-500/10", text: "text-red-500", dot: "bg-red-500", label: "REJECTED" }
        };

        const config = colors[rawStatus] || colors.pending;

        return (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-current/10 ${config.bg} ${config.text} text-[9px] font-black tracking-widest`}>
            <div className={`w-1 h-1 rounded-full ${config.dot} shadow-[0_0_8px_currentColor]`} />
            {config.label}
          </div>
        );
      }
    },

    {
      key: "points",
      title: "Points",
      render: (row) => (
        <span className={`text-[14px] font-black tracking-tight ${row?.status === 'rejected' ? 'text-red-500' : 'text-foreground'}`}>
          {row?.status === 'rejected' ? '0' : row?.status === 'pending' ? '—' : `+${row?.points || 150}`}
        </span>
      )
    }
  ];

  // Table Actions
  const actions = isAdmin ? [
    {
      icon: Eye,
      label: "View",
      onClick: (row) => setPreviewTemple(row)
    },
    {
      icon: CheckCircle,
      label: "Approve",
      className: "text-green-500 hover:bg-green-500/10",
      show: (row) => row.status !== 'approved',
      onClick: (row) => {
        if (window.confirm("Are you sure you want to approve this temple?")) {
          approveMutation.mutate(row._id);
        }
      }
    },
    {
      icon: XCircle,
      label: "Reject",
      className: "text-red-500 hover:bg-red-500/10",
      show: (row) => row.status !== 'rejected',
      onClick: (row) => {
        const reason = window.prompt("Enter reason for rejection:");
        if (reason) rejectMutation.mutate({ id: row._id, reason });
      }
    }
  ] : [
    {
      icon: Eye,
      label: "View",
      onClick: (row) => setPreviewTemple(row)
    },
    {
      icon: Pencil,
      label: "Edit",
      onClick: (row) => console.log("edit", row)
    },
    {
      icon: Trash2,
      label: "Delete",
      className: "text-foreground/40 hover:text-red-500 hover:bg-red-500/10",
      onClick: (row) => console.log("delete", row)
    }
  ];

  const customFilterNode = (
    <div className="relative hidden sm:block">
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="appearance-none bg-secondary-bg border border-border-theme text-foreground/80 md:text-xs font-black rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:border-primary/40 transition-all cursor-pointer uppercase tracking-widest leading-none outline-none shadow-sm"
      >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Filter className="w-3.5 h-3.5 text-foreground/40" />
      </div>
    </div>
  );

  return (
    <>
      <DataTable
        title={isAdmin ? (statusFilter === "all" ? "All Submissions" : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Submissions`) : "My Submissions"}
        columns={columns}
        data={displayTemples}
        loading={isLoading}
        actions={actions}
        pageSize={10}
        filterNode={customFilterNode}
      />
      <TemplePreviewModal
        temple={previewTemple}
        onClose={() => setPreviewTemple(null)}
      />
    </>
  );
};

export default TempleList;
