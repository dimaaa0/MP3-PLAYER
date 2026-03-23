import { PrismaClient } from "@/app/generated/prisma/client";
import prisma from "@/lib/db";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

console.log("Database URL check:", process.env.DATABASE_URL ? "URL found" : "URL NOT FOUND");

async function main() {
    console.log("Attempting to connect to DB...");
    await prisma.$connect();

    const demoAuthor = await prisma.user.upsert({
        where: { email: "pisarenkodimarik@gmail.com" },
        update: {},
        create: {
            email: "pisarenkodimarik@gmail.com",
            name: "dmitriy222",
        },
    });

    console.log("demoAuthor.id", demoAuthor.id);

    const posts = Array.from({ length: 5 }).map((_, i) => ({
        authorId: demoAuthor.id,
        title: `Новый пост #${i + 1}`,
        randomNumber: parseFloat((Math.random() * 100).toFixed(0)),
        published: Math.random() > 0.5,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i * 2)),
    }));

    const result = await prisma.post.createMany({
        data: posts,
        skipDuplicates: true,
    });

    console.log("Success! Posts created:", result.count);
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