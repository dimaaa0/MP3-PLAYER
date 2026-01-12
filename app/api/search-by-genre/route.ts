// app/api/search-by-genre/route.ts
import { NextRequest, NextResponse } from 'next/server';

const LASTFM_API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY; // Добавьте ваш API ключ в .env

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const genre = searchParams.get('genre');

    if (!genre) {
        return NextResponse.json(
            { error: 'Genre parameter is required' },
            { status: 400 }
        );
    }

    if (!LASTFM_API_KEY) {
        return NextResponse.json(
            { error: 'Last.fm API key is not configured' },
            { status: 500 }
        );
    }

    try {
        const tracks = await getTracksByGenre(genre);

        return NextResponse.json({ tracks });
    } catch (error) {
        console.error('Error fetching tracks:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tracks' },
            { status: 500 }
        );
    }
}

async function getTracksByGenre(genre: string) {
    const targetGenre = encodeURIComponent(genre.toLowerCase());

    const topTracksRes = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${targetGenre}&api_key=${LASTFM_API_KEY}&format=json&limit=50`,
        {
            next: { revalidate: 3600 }
        }
    );

    if (!topTracksRes.ok) throw new Error('Ошибка при загрузке треков');

    const topTracksData = await topTracksRes.json();

    if (!topTracksData.tracks?.track) {
        return [];
    }

    // Получаем детальную информацию для каждого трека
    const tracksWithDetails = await Promise.all(
        topTracksData.tracks.track.slice(0, 20).map(async (track: any) => {
            try {
                const artist = encodeURIComponent(track.artist.name);
                const trackName = encodeURIComponent(track.name);

                const detailRes = await fetch(
                    `https://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=${LASTFM_API_KEY}&artist=${artist}&track=${trackName}&format=json`,
                    {
                        next: { revalidate: 3600 }
                    }
                );

                if (!detailRes.ok) return track;

                const detailData = await detailRes.json();

                return {
                    name: track.name,
                    artist: track.artist.name,
                    url: track.url,
                    image: track.image,
                    // Детальная информация
                    duration: detailData.track?.duration || null,
                    playcount: detailData.track?.playcount || track.playcount || 0,
                    listeners: detailData.track?.listeners || 0,
                    album: detailData.track?.album || null,
                    tags: detailData.track?.toptags?.tag || [],
                    wiki: detailData.track?.wiki || null,
                };
            } catch (error) {
                console.error(`Error fetching details for ${track.name}:`, error);
                return track;
            }
        })
    );

    return tracksWithDetails;
}