import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Lead } from "@/types/lead";

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  onUpdateStatus: (id: string, status: "PENDING" | "REACHED_OUT") => void;
}

export function LeadsTable({
  leads,
  isLoading,
  onUpdateStatus,
}: LeadsTableProps) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-medium">Name</TableHead>
            <TableHead className="font-medium">Submitted</TableHead>
            <TableHead className="font-medium">Status</TableHead>
            <TableHead className="font-medium">Country</TableHead>
            <TableHead className="font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>
                {lead.firstName} {lead.lastName}
              </TableCell>
              <TableCell>
                {new Date(lead.submittedAt).toLocaleString()}
              </TableCell>
              <TableCell>{lead.status}</TableCell>
              <TableCell>{lead.country}</TableCell>
              <TableCell>
                {lead.status === "PENDING" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateStatus(lead.id, "REACHED_OUT")}
                  >
                    Mark as Reached Out
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
