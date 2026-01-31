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

        let duration: number | null = null;
        try {
            const LASTFM_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY;
            if (LASTFM_KEY) {
                const infoUrl = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${LASTFM_KEY}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&format=json`;
                const infoResp = await fetch(infoUrl);
                if (infoResp.ok) {
                    const infoData = await infoResp.json();
                    const rawDuration = infoData.track?.duration;
                    if (rawDuration) {
                        const parsed = parseInt(rawDuration);
                        duration = isNaN(parsed) ? null : parsed;
                    }
                }
            }
        } catch (err) {
            console.warn('Failed to fetch track duration from Last.fm', err);
        }

        return NextResponse.json({ videoId, duration });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch video ID" }, { status: 500 });
    }
}