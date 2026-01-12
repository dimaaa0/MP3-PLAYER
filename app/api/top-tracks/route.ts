import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY;

    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre') || 'pop';

    try {
        const response = await fetch(
            `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${genre}&api_key=${API_KEY}&format=json&limit=20`,
            { next: { revalidate: 3600 } }
        );

        const data = await response.json();

        if (data.error) {
            return NextResponse.json(
                { error: data.message },
                { status: data.error === 6 ? 404 : 400 }
            );
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'server mistake' }, { status: 500 });
    }
}