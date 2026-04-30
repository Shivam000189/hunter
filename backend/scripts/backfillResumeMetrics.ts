import prisma from "../src/config/prisma";

async function main() {
  const jobs = await prisma.job.findMany({
    where: {
      resumeId: {
        not: null,
      },
    },
    select: {
      resumeId: true,
      status: true,
    },
  });

  const stats = new Map<
    string,
    { totalUsed: number; interviews: number; offers: number }
  >();

  for (const job of jobs) {
    if (!job.resumeId) continue;

    const stat = stats.get(job.resumeId) || {
      totalUsed: 0,
      interviews: 0,
      offers: 0,
    };

    stat.totalUsed += 1;

    if (job.status === "INTERVIEW") {
      stat.interviews += 1;
    }

    if (job.status === "OFFER") {
      stat.offers += 1;
    }

    stats.set(job.resumeId, stat);
  }

  for (const [id, stat] of stats) {
    await prisma.resume.update({
      where: { id },
      data: stat,
    });
  }

  console.log(`Backfilled ${stats.size} resume metric rows`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
