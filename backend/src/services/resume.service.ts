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