import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AiInterview } from "../../pages/AiInterview";
import { AuthProvider } from "../../context/AuthContext";
import { ThemeProvider } from "../../context/ThemeContext";
import api from "../../api/client";

vi.mock("../../api/client", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

describe("AiInterview Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (api.get as any).mockResolvedValue({ data: { data: [] } });
  });

  it("renders interview setup form with default role and difficulty controls", async () => {
    renderWithProviders(<AiInterview />);

    expect(screen.getByText("AI Mock Interview Simulator")).toBeInTheDocument();
    expect(screen.getByText("Interactive Interview Studio")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Software Engineer")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "easy" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "medium" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "hard" })).toBeInTheDocument();
    expect(screen.getByText("The STAR Methodology")).toBeInTheDocument();
  });

  it("allows switching difficulty level", () => {
    renderWithProviders(<AiInterview />);

    const hardBtn = screen.getByRole("button", { name: "hard" });
    fireEvent.click(hardBtn);
    expect(hardBtn).toHaveClass("text-indigo-700");
  });

  it("starts practice session and displays first interview question and voice dictation button", async () => {
    (api.post as any).mockResolvedValue({
      data: {
        data: {
          id: "interview-123",
          totalQuestions: 5,
          conversation: [
            {
              message: "Describe an architecture trade-off you made recently.",
              type: "ASSISTANT",
            },
          ],
        },
      },
    });

    renderWithProviders(<AiInterview />);

    const startButtons = screen.getAllByRole("button", { name: /start|begin/i });
    fireEvent.click(startButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Live Interview Simulation")).toBeInTheDocument();
      expect(
        screen.getByText('"Describe an architecture trade-off you made recently."')
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Voice Dictation")).toBeInTheDocument();
    expect(screen.getByText("Listen")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/speak or outline the situation/i)).toBeInTheDocument();
  });
});
