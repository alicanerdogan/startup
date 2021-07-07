import { PrismaClient } from "@prisma/client";

export const dbConn = new PrismaClient();

export async function closeDBConnection() {
  await dbConn.$disconnect();
}

export async function resetDB() {
  const isTestEnvironment = process.env.NODE_ENV === "test";
  if (!isTestEnvironment) {
    throw new Error("Do not reset database on environments other than test");
  }

  await dbConn.user.deleteMany({ where: { id: { not: undefined } } });
}
