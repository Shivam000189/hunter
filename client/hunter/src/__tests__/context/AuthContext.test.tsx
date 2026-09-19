import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { AuthProvider, useAuth } from "../../context/AuthContext";

function TestAuthConsumer() {
  const { token, isGuest, hasRecentLogin, login, logout } = useAuth();

  return (
    <div>
      <div data-testid="token">{token ?? "no-token"}</div>
      <div data-testid="is-guest">{String(isGuest)}</div>
      <div data-testid="has-recent">{String(hasRecentLogin)}</div>
      <button onClick={() => login("test-jwt-token", false)}>Login User</button>
      <button onClick={() => login("guest-jwt-token", true)}>Login Guest</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("initializes with default unauthenticated state when localStorage is empty", () => {
    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId("token")).toHaveTextContent("no-token");
    expect(screen.getByTestId("is-guest")).toHaveTextContent("false");
    expect(screen.getByTestId("has-recent")).toHaveTextContent("false");
  });

  it("restores active session from localStorage if logged in within 24h", () => {
    const now = Date.now();
    localStorage.setItem("token", "stored-token");
    localStorage.setItem("isGuest", "false");
    localStorage.setItem("loggedInAt", String(now - 1000 * 60 * 30)); // 30 minutes ago

    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId("token")).toHaveTextContent("stored-token");
    expect(screen.getByTestId("is-guest")).toHaveTextContent("false");
    expect(screen.getByTestId("has-recent")).toHaveTextContent("true");
  });

  it("evaluates hasRecentLogin as false when login was more than 24h ago", () => {
    const past = Date.now() - 25 * 60 * 60 * 1000; // 25 hours ago
    localStorage.setItem("token", "old-token");
    localStorage.setItem("isGuest", "false");
    localStorage.setItem("loggedInAt", String(past));

    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId("token")).toHaveTextContent("old-token");
    expect(screen.getByTestId("has-recent")).toHaveTextContent("false");
  });

  it("updates state and localStorage on login()", () => {
    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    );

    act(() => {
      screen.getByText("Login User").click();
    });

    expect(screen.getByTestId("token")).toHaveTextContent("test-jwt-token");
    expect(screen.getByTestId("is-guest")).toHaveTextContent("false");
    expect(screen.getByTestId("has-recent")).toHaveTextContent("true");
    expect(localStorage.getItem("token")).toBe("test-jwt-token");
    expect(localStorage.getItem("isGuest")).toBe("false");
  });

  it("supports guest login with isGuest set to true", () => {
    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    );

    act(() => {
      screen.getByText("Login Guest").click();
    });

    expect(screen.getByTestId("token")).toHaveTextContent("guest-jwt-token");
    expect(screen.getByTestId("is-guest")).toHaveTextContent("true");
    expect(localStorage.getItem("isGuest")).toBe("true");
  });

  it("clears state and localStorage on logout()", () => {
    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    );

    act(() => {
      screen.getByText("Login User").click();
    });

    expect(screen.getByTestId("token")).toHaveTextContent("test-jwt-token");

    act(() => {
      screen.getByText("Logout").click();
    });

    expect(screen.getByTestId("token")).toHaveTextContent("no-token");
    expect(screen.getByTestId("is-guest")).toHaveTextContent("false");
    expect(screen.getByTestId("has-recent")).toHaveTextContent("false");
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("isGuest")).toBeNull();
  });

  it("throws error when useAuth is accessed outside AuthProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TestAuthConsumer />)).toThrow(
      "useAuth must be used inside AuthProvider"
    );

    spy.mockRestore();
  });
});
