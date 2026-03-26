import { NextResponse } from 'next/server';

// Используйте приватную переменную для серверного кода
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

interface LastFmTag {
    name: string;
    count: number;
    reach: number;
}

interface Category {
    id: number;
    label: string;
    active: boolean;
}

export async function GET() {
    if (!LASTFM_API_KEY) {
        return NextResponse.json(
            { error: 'Last.fm API key is not configured' },
            { status: 500 }
        );
    }

    try {
        const response = await fetch(
            `https://ws.audioscrobbler.com/2.0/?method=tag.getTopTags&api_key=${LASTFM_API_KEY}&format=json&limit=50`,
            { next: { revalidate: 86400 } }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch categories from Last.fm');
        }

        const data = await response.json();

        if (!data.tags?.tag) {
            return NextResponse.json({ categories: [] });
        }

        // Transform tags to categories format
        const categories: Category[] = data.tags.tag.map((tag: LastFmTag, index: number) => ({
            id: index + 1,
            label: tag.name.charAt(0).toUpperCase() + tag.name.slice(1),
            active: false, // Убрал конфликт - только "All" будет активным
        }));

        // Add "Favorites" and "All" at the beginning
        const enrichedCategories: Category[] = [
            { id: 0, label: 'Favorites', active: false },
            { id: 10000, label: 'All', active: true },
            ...categories,
        ];

        return NextResponse.json({ categories: enrichedCategories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories', categories: [] },
            { status: 500 }
        );
    }
}