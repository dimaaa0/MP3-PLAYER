import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    console.log("BODY received:", body);

    const { name, artist, duration, imageUrl } = body;

    if (!name || !artist)
      return NextResponse.json(
        { error: "No track data provided" },
        { status: 400 },
      );

    const slug = `${artist}-${name}`.toLowerCase().replace(/\s+/g, "-");
    console.log("Slug:", slug); 

    const track = await prisma.track.upsert({
      where: { slug },
      update: {},
      create: {
        name,
        artist,
        duration: duration ? parseInt(duration) : 0,
        imageUrl: imageUrl || null,
        slug,
      },
    });
    console.log("Track upserted:", track.id);

    const existing = await prisma.favoriteTrack.findUnique({
      where: {
        trackId_userId: { trackId: track.id, userId: user.id },
      },
    });
    console.log("Existing favorite:", existing);

    if (existing) {
      await prisma.favoriteTrack.delete({ where: { id: existing.id } });
      return NextResponse.json({ favorited: false });
    }

    await prisma.favoriteTrack.create({
      data: { trackId: track.id, userId: user.id },
    });

    return NextResponse.json({ favorited: true });
  } catch (error) {
    console.error("API Error FULL:", error); 
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
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
    return NextResponse.json([], { status: 500 });
  }
}
