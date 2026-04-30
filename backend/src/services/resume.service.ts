import cloudinary from "../config/cloudinary";
import prisma from "../config/prisma";

export const uploadResume = async (
  userId: string,
  file: Express.Multer.File,
  versionName: string
) => {
  if (!file) {
    throw { status: 400, message: "File required" };
  }

  const base64 = file.buffer.toString("base64");

  const uploadResult = await cloudinary.uploader.upload(
    `data:application/pdf;base64,${base64}`,
    {
      resource_type: "raw",
      folder: "resumes",
    }
  );

  const resume = await prisma.resume.create({
    data: {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      versionName,
      userId,
    },
  });

  return resume;
};

// GET ALL
export const getResumes = async (userId: string) => {
  return prisma.resume.findMany({
    where: { userId },
    orderBy: { uploadedAt: "desc" },
    include: {
      _count: {
        select: { jobs: true },
      },
    },
  });
};

// GET ONE
export const getResumeById = async (userId: string, id: string) => {
  const resume = await prisma.resume.findUnique({ where: { id } });

  if (!resume || resume.userId !== userId) {
    throw { status: 403, message: "Not allowed" };
  }

  return resume;
};

// DELETE
export const deleteResume = async (userId: string, id: string) => {
  const resume = await getResumeById(userId, id);

  await cloudinary.uploader.destroy(resume.publicId, {
    resource_type: "raw",
  });

  await prisma.resume.delete({ where: { id } });
};

export const getResumeAnalytics = async (userId: string) => {
  const resumes = await prisma.resume.findMany({
    where: { userId },
    orderBy: [
      { offers: "desc" },
      { interviews: "desc" },
      { totalUsed: "desc" },
      { uploadedAt: "desc" },
    ],
    select: {
      id: true,
      versionName: true,
      url: true,
      totalUsed: true,
      interviews: true,
      offers: true,
      uploadedAt: true,
    },
  });

  const data = resumes.map((resume) => ({
    _id: resume.id,
    versionName: resume.versionName,
    url: resume.url,
    usage: resume.totalUsed,
    interviews: resume.interviews,
    offers: resume.offers,
    successRate: resume.totalUsed
      ? Number(((resume.interviews / resume.totalUsed) * 100).toFixed(1))
      : 0,
    offerRate: resume.totalUsed
      ? Number(((resume.offers / resume.totalUsed) * 100).toFixed(1))
      : 0,
    uploadedAt: resume.uploadedAt,
  }));

  return {
    bestPerformingResume:
      data.length > 0
        ? [...data].sort((a, b) => {
            if (b.successRate !== a.successRate) {
              return b.successRate - a.successRate;
            }

            if (b.offers !== a.offers) {
              return b.offers - a.offers;
            }

            return b.usage - a.usage;
          })[0]
        : null,
    resumes: data,
  };
};
