import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const artist = searchParams.get("artist");
    const track = searchParams.get("track");

    if (!artist || !track) {
        return NextResponse.json({ error: "Missing artist or track parameter" }, { status: 400 });
    }

    const query = encodeURIComponent(`${artist} ${track}`);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=1&key=${process.env.YOUTUBE_API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Ошибка сервера:", errorText);
            throw new Error('Server returned HTML instead of JSON');
        }
        const data = await response.json();
        const videoId = data.items?.[0]?.id?.videoId;
        return NextResponse.json({ videoId });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch video ID" }, { status: 500 });
    }
}