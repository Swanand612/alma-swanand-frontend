"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { setLeads, updateLeadStatus, setLoading } from "@/store/leadSlice";
import { RootState, AppDispatch } from "@/store/store";
import { LeadsTable } from "@/components/leads-table";

export default function LeadsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { leads, isLoading } = useSelector((state: RootState) => state.leads);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLeads = async () => {
      dispatch(setLoading(true));
      try {
        const response = await fetch("/api/leads");
        const data = await response.json();
        dispatch(setLeads(data.leads));
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };
    fetchLeads();
  }, [dispatch]);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      search === "" ||
      `${lead.firstName} ${lead.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      lead.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleUpdateStatus = async (
    id: string,
    status: "PENDING" | "REACHED_OUT"
  ) => {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update lead status");

      dispatch(updateLeadStatus({ id, status }));
    } catch (error) {
      console.error("Error updating lead status:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Leads</h1>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reached_out">Reached Out</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <LeadsTable
        leads={paginatedLeads}
        isLoading={isLoading}
        onUpdateStatus={handleUpdateStatus}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <div className="text-sm">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
