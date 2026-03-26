import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const artist = searchParams.get('artist');
    const track = searchParams.get('track');
    const API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY;

    if (!artist || !track) {
        return NextResponse.json({ error: 'Singer and track are required' }, { status: 400 });
    }

    try {
        const response = await fetch(
            `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${API_KEY}&artist=${encodeURIComponent(
                artist
            )}&track=${encodeURIComponent(track)}&format=json`
        );

        const data = await response.json();

        if (data.error) {
            return NextResponse.json({ error: data.message }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'server mistake' }, { status: 500 });
    }
}
