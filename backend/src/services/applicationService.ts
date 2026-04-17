import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";

interface QueryOptions {
  status?: string | undefined;
  search?: string | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}

export const createApplicationService = async (data: any) => {
  return await prisma.application.create({ data });
};

export const getApplicationsService = async (options: QueryOptions) => {
  const { status, search, page = 1, limit = 10 } = options;

  const where: any = {};

  if (status) where.status = status;

  if (search) {
    where.OR = [
      { company: { contains: search, mode: "insensitive" } },
      { role: { contains: search, mode: "insensitive" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [total, data] = await Promise.all([
    prisma.application.count({ where }),
    prisma.application.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
  ]);

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    data,
  };
};

export const updateApplicationService = async (id: string, status: string) => {
  const existing = await prisma.application.findUnique({ where: { id } });

  if (!existing) throw new AppError("Application not found", 404);

  return await prisma.application.update({
    where: { id },
    data: { status },
  });
};

export const deleteApplicationService = async (id: string) => {
  const existing = await prisma.application.findUnique({ where: { id } });

  if (!existing) throw new AppError("Application not found", 404);

  await prisma.application.delete({ where: { id } });
};