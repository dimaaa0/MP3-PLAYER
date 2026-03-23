import { PrismaClient } from "@/app/generated/prisma/client";
import prisma from "@/lib/db";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

console.log("Database URL check:", process.env.DATABASE_URL ? "URL found" : "URL NOT FOUND");

async function main() {
    console.log("Attempting to connect to DB...");
    await prisma.$connect();

    const demoAuthor = '9215b98c-c543-44f1-a7b8-9244a3edf0a9'


    await prisma.post.createMany({
        data: Array.from({ length: 5 }).map((_, i) => ({
            userId: demoAuthor,
            name: `Post ${i + 1}`,
            createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * 24),
            randomNumber: Number(Math.random().toFixed(0)),
        })),
    });
    console.log("Seed data inserted successfully. You have added 5 posts for userId:", demoAuthor);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("Seed failed:", e);
        await prisma.$disconnect();
        process.exit(1);
    });