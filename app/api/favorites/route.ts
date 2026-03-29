import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const parseDuration = (duration: any): number => {
  if (!duration) return 0;
  if (typeof duration === "number") return duration;
  if (typeof duration !== "string") return 0;

  if (!duration.includes(":")) return parseInt(duration) || 0;

  const [minutes, seconds] = duration.split(":").map(Number);
  return (minutes || 0) * 60 + (seconds || 0);
};

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, artist, duration, imageUrl } = body;

    if (!name || !artist) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const slug = `${artist}-${name}`
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") 
      .replace(/\s+/g, "-");

    const trackDuration = parseDuration(duration);

    const track = await prisma.track.upsert({
      where: { slug },
      update: {
        duration: trackDuration,
        imageUrl: imageUrl || null,
      },
      create: {
        name,
        artist,
        slug,
        duration: trackDuration,
        imageUrl: imageUrl || null,
      },
    });

    const favoriteWhere = {
      trackId_userId: {
        trackId: track.id,
        userId: user.id,
      },
    };

    const existing = await prisma.favoriteTrack.findUnique({
      where: favoriteWhere,
    });

    if (existing) {
      await prisma.favoriteTrack.delete({ where: favoriteWhere });
      return NextResponse.json({ favorited: false });
    }

    await prisma.favoriteTrack.create({
      data: { trackId: track.id, userId: user.id },
    });

    return NextResponse.json({ favorited: true });
  } catch (error) {
    console.error("[FAVORITES_POST]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const favorites = await prisma.favoriteTrack.findMany({
      where: { userId: user.id },
      include: { track: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("[FAVORITES_GET]", error);
    return NextResponse.json([], { status: 500 });
  }
}
