export interface IApplication {
  company: string;
  role: string;
  status: "Applied" | "Interview" | "Offer" | "Rejected";
  appliedDate?: Date;
  notes?: string;
}