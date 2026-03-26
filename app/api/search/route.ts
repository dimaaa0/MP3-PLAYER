import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY;

    if (!query) {
        return NextResponse.json({ error: 'Параметр q обязателен' }, { status: 400 });
    }

    try {
        const response = await fetch(
            `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(
                query
            )}&api_key=${API_KEY}&format=json`
        );

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
    }
}