import { vi } from "vitest";

export const mockTx = {
  job: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  resume: {
    update: vi.fn(),
  },
};

export const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
    findMany: vi.fn(),
  },
  job: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
  resume: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
  coverLetter: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
  },
  reminderSettings: {
    create: vi.fn(),
    upsert: vi.fn(),
  },
  reminderLog: {
    create: vi.fn(),
    findMany: vi.fn(),
  },
  $transaction: vi.fn(async (callback: (tx: typeof mockTx) => unknown) =>
    callback(mockTx)
  ),
  $disconnect: vi.fn(),
};

const prismaMocks = [
  mockPrisma.user.findUnique,
  mockPrisma.user.create,
  mockPrisma.user.findMany,
  mockPrisma.job.findMany,
  mockPrisma.job.findUnique,
  mockPrisma.job.count,
  mockPrisma.job.update,
  mockPrisma.job.create,
  mockPrisma.job.delete,
  mockPrisma.resume.findUnique,
  mockPrisma.resume.findMany,
  mockPrisma.resume.update,
  mockPrisma.resume.create,
  mockPrisma.resume.delete,
  mockPrisma.coverLetter.create,
  mockPrisma.coverLetter.findMany,
  mockPrisma.coverLetter.findUnique,
  mockPrisma.reminderSettings.create,
  mockPrisma.reminderSettings.upsert,
  mockPrisma.reminderLog.create,
  mockPrisma.reminderLog.findMany,
  mockPrisma.$transaction,
  mockPrisma.$disconnect,
  mockTx.job.create,
  mockTx.job.update,
  mockTx.job.delete,
  mockTx.resume.update,
];

export const resetPrismaMocks = () => {
  prismaMocks.forEach((mockFn) => mockFn.mockReset());
  mockPrisma.$transaction.mockImplementation(
    async (callback: (tx: typeof mockTx) => unknown) => callback(mockTx)
  );
};
