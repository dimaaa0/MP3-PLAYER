import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

// Find all users with their posts
const users = await prisma.user.findMany({
    include: { posts: true },
});

// Create a user with a post
const user = await prisma.user.create({
    data: {
        email: "alice@prisma.io",
        posts: {
            create: { title: "Hello World" },
        },
    },
});