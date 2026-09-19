import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { KanbanColumn } from "../../components/jobs/KanbanColumn";

describe("KanbanColumn", () => {
  it("renders column title and job count", () => {
    const jobs = [
      { title: "Frontend Engineer", company: "Google" },
      { title: "Backend Engineer", company: "Meta" },
    ];

    render(<KanbanColumn title="Applied" jobs={jobs} />);

    expect(screen.getByRole("heading", { level: 3, name: "Applied" })).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders empty state with zero count when no jobs are present", () => {
    render(<KanbanColumn title="Interviews" jobs={[]} />);

    expect(screen.getByRole("heading", { level: 3, name: "Interviews" })).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders job cards with their respective titles and company names", () => {
    const jobs = [
      { title: "Full Stack Developer", company: "Netflix" },
    ];

    render(<KanbanColumn title="Offers" jobs={jobs} />);

    expect(screen.getByText("Full Stack Developer")).toBeInTheDocument();
    expect(screen.getByText("Netflix")).toBeInTheDocument();
  });
});
