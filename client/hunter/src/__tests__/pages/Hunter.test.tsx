import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Hunter } from "../../pages/Hunter";
import { ThemeProvider } from "../../context/ThemeContext";

describe("Hunter Landing Page (hunter-new-analytics Blueprint)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <ThemeProvider>
          <Hunter />
        </ThemeProvider>
      </MemoryRouter>
    );

  it("renders Hero section with trust badge, headline, and primary CTAs", () => {
    renderComponent();

    // Trust badge
    expect(screen.getByText(/Trusted by/i)).toBeInTheDocument();
    expect(screen.getByText(/10,000\+/i)).toBeInTheDocument();

    // Headline & Subhead
    expect(
      screen.getByRole("heading", { name: /Turn Application Chaos/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/One simple board to track your job search/i)
    ).toBeInTheDocument();

    // CTA & Sign In
    expect(screen.getAllByText(/Start Free Today/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Sign In/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders interactive Board section with KPI metrics and Kanban pipeline", () => {
    renderComponent();

    // Sidebar navigation tabs
    expect(screen.getByRole("button", { name: /Pipeline Board/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Interviews/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Analytics Studio/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Offer Pipeline/i })).toBeInTheDocument();

    // KPI metrics
    expect(screen.getByText(/Total Applications/i)).toBeInTheDocument();
    expect(screen.getAllByText(/34.2%/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Interviews Active/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Offers/i)).toBeInTheDocument();

    // Default Kanban columns and cards
    expect(screen.getByText(/^Applied$/i)).toBeInTheDocument();
    expect(screen.getByText("Stripe")).toBeInTheDocument();
    expect(screen.getByText("Linear")).toBeInTheDocument();
    expect(screen.getByText("Airbnb")).toBeInTheDocument();
    expect(screen.getByText("OpenAI")).toBeInTheDocument();
  });

  it("switches board tabs to Analytics and Interviews views", async () => {
    renderComponent();

    // Switch to Analytics Studio tab
    const analyticsTab = screen.getByRole("button", { name: /Analytics Studio/i });
    fireEvent.click(analyticsTab);

    await waitFor(() => {
      expect(
        screen.getByText(/Application Velocity & Interview Trajectory/i)
      ).toBeInTheDocument();
    });

    // Switch to Interviews tab
    const interviewsTab = screen.getByRole("button", { name: /Interviews/i });
    fireEvent.click(interviewsTab);

    await waitFor(() => {
      expect(
        screen.getByText(/AI Voice Mock Interview Studio/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Listening to Candidate Response/i)
      ).toBeInTheDocument();
    });
  });

  it("renders 3-step structure process section (How It Works)", () => {
    renderComponent();

    expect(screen.getAllByText(/How It Works/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Get Hired In 3 Simple Steps/i)).toBeInTheDocument();

    // 3 Steps
    expect(screen.getByText(/One-Click Opportunity Capture/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Tailoring & Smart Reminders/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Voice Mocks & Comp Negotiation/i)).toBeInTheDocument();

    // Visual indicators
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });

  it("renders clean 12-column footer with brand and links", () => {
    renderComponent();

    expect(screen.getByText(/Built with React, Tailwind CSS & Framer Motion/i)).toBeInTheDocument();
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
    expect(screen.getByText(/Tech Salary Guide/i)).toBeInTheDocument();
  });
});
