import { LeadsTable } from "@/components/leads-table";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Lead, LeadStatus } from "@/types/lead";

const mockLeads = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    linkedin: "https://linkedin.com/johndoe",
    country: "USA",
    visas: ["o1"],
    message: "Test message",
    status: "PENDING",
    submittedAt: "2024-01-10T08:51:59.649Z",
    resumeFilename: "resume.pdf",
  },
];

describe("LeadsTable", () => {
  it("renders loading state", () => {
    render(
      <LeadsTable leads={[]} isLoading={true} onUpdateStatus={() => {}} />
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders table with leads data", () => {
    const typedMockLeads: Lead[] = mockLeads.map((lead) => ({
      ...lead,
      status: lead.status as LeadStatus,
    }));
    render(
      <LeadsTable
        leads={typedMockLeads}
        isLoading={false}
        onUpdateStatus={() => {}}
      />
    );
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("USA")).toBeInTheDocument();
    expect(screen.getByText("PENDING")).toBeInTheDocument();
  });
  it("calls onUpdateStatus when status button is clicked", () => {
    const mockOnUpdateStatus = jest.fn();
    const typedMockLeads: Lead[] = mockLeads.map((lead) => ({
      ...lead,
      status: lead.status as LeadStatus,
    }));
    render(
      <LeadsTable
        leads={typedMockLeads}
        isLoading={false}
        onUpdateStatus={mockOnUpdateStatus}
      />
    );

    const button = screen.getByText("Mark as Reached Out");
    fireEvent.click(button);

    expect(mockOnUpdateStatus).toHaveBeenCalledWith("1", "REACHED_OUT");
  });
  it("does not show status button for REACHED_OUT leads", () => {
    const reachedOutLeads = [
      { ...mockLeads[0], status: "REACHED_OUT" as const },
    ];
    render(
      <LeadsTable
        leads={reachedOutLeads}
        isLoading={false}
        onUpdateStatus={() => {}}
      />
    );

    expect(screen.queryByText("Mark as Reached Out")).not.toBeInTheDocument();
  });
});
