import { vi } from "vitest";

export const mockHashPassword = vi.fn();
export const mockComparePassword = vi.fn();

export const resetHashMocks = () => {
  mockHashPassword.mockReset();
  mockComparePassword.mockReset();
};
