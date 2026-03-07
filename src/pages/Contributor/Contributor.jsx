import React from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getContributorRequests, approveContributorRequest, rejectContributorRequest } from "../../features/contributors/contributorApi";
import DataTable from "../../components/ui/DataTable";
import { UserCheck, UserX, Mail, MapPin, Calendar, MessageSquare, ShieldCheck, Users, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Contributor Management Page
 * Displays a table of heritage contributor applications with Approve/Reject actions.
 */
const Contributor = () => {
  const queryClient = useQueryClient();

  // 1. Fetch Requests
  const {
    data: requests = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ["contributor-requests"],
    queryFn: getContributorRequests
  });

  // 2. Approve Mutation
  const approveMutation = useMutation({
    mutationFn: approveContributorRequest,
    onSuccess: () => {
      toast.success("Contributor approved successfully!");
      queryClient.invalidateQueries(["contributor-requests"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Approval failed");
    }
  });

  // 3. Reject Mutation
  const rejectMutation = useMutation({
    mutationFn: rejectContributorRequest,
    onSuccess: () => {
      toast.success("Request rejected.");
      queryClient.invalidateQueries(["contributor-requests"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Rejection failed");
    }
  });

  // Table Column Configuration
  const columns = [
    {
      key: "applicant",
      title: "Applicant Details",
      render: (row) => (
        <div className="flex items-center gap-3 group/item">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 group-hover/item:bg-primary/20 transition-all shadow-sm">
            <span className="text-primary font-black text-sm">{row?.name?.[0]?.toUpperCase() || 'U'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-foreground font-bold text-[14px] leading-tight tracking-tight group-hover/item:text-primary transition-colors">
              {row?.name || "Unknown Applicant"}
            </span>
            <div className="flex items-center gap-1.5 text-foreground/40 text-[10px] font-bold uppercase tracking-wider mt-0.5">
              <Mail className="w-2.5 h-2.5" />
              <span className="truncate max-w-[150px]">{row?.email}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      key: "location",
      title: "District",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-foreground/60 text-xs font-bold uppercase tracking-widest">
          <MapPin className="w-3 h-3 text-primary/40" />
          {row?.district || "Not Specified"}
        </div>
      )
    },
    {
      key: "message",
      title: "Motivation",
      render: (row) => (
        <div className="flex items-start gap-2 max-w-[200px] group/msg">
          <MessageSquare className="w-3 h-3 text-foreground/20 mt-1 shrink-0" />
          <p className="text-[11px] font-medium text-foreground/50 leading-relaxed italic line-clamp-2 group-hover/msg:line-clamp-none transition-all">
            "{row?.message || "No motivation provided."}"
          </p>
        </div>
      )
    },
    {
      key: "date",
      title: "Applied On",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-foreground/40 text-[11px] font-bold">
          <Calendar className="w-3 h-3" />
          {row?.createdAt ? new Date(row.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }) : '—'}
        </div>
      )
    },
    {
      key: "status",
      title: "Status",
      render: (row) => {
        const status = String(row?.status || 'pending').toLowerCase();
        const config = {
          approved: { bg: "bg-green-500/10", text: "text-green-500", dot: "bg-green-500", label: "VERIFIED" },
          pending: { bg: "bg-orange-500/10", text: "text-orange-500", dot: "bg-orange-500", label: "PENDING" },
          rejected: { bg: "bg-red-500/10", text: "text-red-500", dot: "bg-red-500", label: "DENIED" }
        };
        const c = config[status] || config.pending;

        return (
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-current/10 ${c.bg} ${c.text} text-[9px] font-black tracking-[0.2em]`}>
            <div className={`w-1 h-1 rounded-full ${c.dot} shadow-[0_0_8px_currentColor] ${status === 'pending' ? 'animate-pulse' : ''}`} />
            {c.label}
          </div>
        );
      }
    }
  ];

  // Actions Configuration
  const actions = [
    {
      icon: ShieldCheck,
      label: "Approve",
      className: "text-green-500 hover:bg-green-500/10",
      show: (row) => row.status === 'pending',
      onClick: (row) => approveMutation.mutate(row._id)
    },
    {
      icon: UserX,
      label: "Reject",
      className: "text-red-500 hover:bg-red-500/10",
      show: (row) => row.status === 'pending',
      onClick: (row) => rejectMutation.mutate(row._id)
    }
  ];

  // Safe data access
  const safeRequests = Array.isArray(requests) ? requests : [];
  const pendingCount = safeRequests.filter(r => r.status === 'pending').length;

  if (isError) {
    return (
      <div className="p-12 bg-red-500/5 border border-red-500/10 rounded-[2.5rem] text-center max-w-4xl mx-auto mt-10">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">Syncing Failure</h3>
        <p className="text-foreground/40 text-sm font-medium">We couldn't retrieve the contributor requests from our servers.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Heritage Guardians</h2>
          <p className="text-foreground/40 text-sm font-medium mt-1 uppercase tracking-widest flex items-center gap-2">
            <Users className="w-4 h-4" />
            Management of Contributor Applications
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-secondary-bg/50 border border-border-theme rounded-2xl shadow-sm">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest leading-none">Total Unprocessed</span>
            <span className="text-lg font-black text-primary leading-tight">
              {pendingCount}
            </span>
          </div>
        </div>
      </div>

      <DataTable
        title="Application Oversight"
        columns={columns}
        data={safeRequests}
        loading={isLoading}
        actions={actions}
        pageSize={8}
      />
    </div>
  );
};

export default Contributor;