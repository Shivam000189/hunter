import Application from "../models/Application";
import { AppError } from "../utils/AppError";


interface QueryOptions {
  status?: string | undefined;
  search?: string | undefined;
  page?: number;
  limit?: number;
}

// CREATE
export const createApplicationService = async (data: any) => {
  return await Application.create(data);
};

// GET ALL (with filters)
export const getApplicationsService = async (options: QueryOptions) => {
  const { status, search, page = 1, limit = 10 } = options;

  const query: any = {};

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { company: { $regex: search, $options: "i" } },
      { role: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const total = await Application.countDocuments(query);

  const data = await Application.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    data,
  };
};

// UPDATE
export const updateApplicationService = async (
  id: string,
  status: string
) => {
  const app = await Application.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!app) {
    throw new AppError("Application not found", 404);
  }

  return app;
};

// DELETE
export const deleteApplicationService = async (id: string) => {
  const app = await Application.findByIdAndDelete(id);

  if (!app) {
    throw new AppError("Application not found", 404);
  }

  return;
};