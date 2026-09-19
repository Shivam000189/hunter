import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ThemeProvider, useTheme } from "../../context/ThemeContext";

function TestThemeConsumer() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <div data-testid="is-dark">{String(isDark)}</div>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.classList.remove("dark");
  });

  it("initializes with saved theme from localStorage", () => {
    localStorage.setItem("hunter-theme", "dark");

    render(
      <ThemeProvider>
        <TestThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(screen.getByTestId("is-dark")).toHaveTextContent("true");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("initializes with default light theme when localStorage is empty", () => {
    render(
      <ThemeProvider>
        <TestThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(screen.getByTestId("is-dark")).toHaveTextContent("false");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("toggles theme from light to dark and back", () => {
    render(
      <ThemeProvider>
        <TestThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("light");

    act(() => {
      screen.getByText("Toggle Theme").click();
    });

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(screen.getByTestId("is-dark")).toHaveTextContent("true");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("hunter-theme")).toBe("dark");

    act(() => {
      screen.getByText("Toggle Theme").click();
    });

    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(screen.getByTestId("is-dark")).toHaveTextContent("false");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("hunter-theme")).toBe("light");
  });

  it("throws error when useTheme is accessed outside ThemeProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TestThemeConsumer />)).toThrow(
      "useTheme must be used inside ThemeProvider"
    );

    spy.mockRestore();
  });
});
