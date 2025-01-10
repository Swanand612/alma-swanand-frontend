import { promises as fs } from "fs";
import path from "path";

export async function updateLeadStatus(leadId: string, newStatus: string) {
  const dbPath = path.join(process.cwd(), "db.json");
  const fileContents = await fs.readFile(dbPath, "utf8");
  const data = JSON.parse(fileContents);

  const updatedLeads = data.leads.map((lead: any) => {
    if (lead.id === leadId) {
      return { ...lead, status: newStatus };
    }
    return lead;
  });

  const updatedData = { ...data, leads: updatedLeads };
  await fs.writeFile(dbPath, JSON.stringify(updatedData, null, 2));

  return updatedData.leads;
}
