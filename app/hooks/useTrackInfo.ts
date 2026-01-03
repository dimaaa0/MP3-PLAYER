import { useState, useEffect } from 'react';
import { Track, favoritesType } from '../types/types';

const formatDuration = (duration: string | number): string => {
    const ms = typeof duration === 'string' ? parseInt(duration) : duration;
    if (!ms || isNaN(ms)) return '--:--';

    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const useTrackInfo = (music: Track[]): favoritesType => {
    const [duration, setDuration] = useState<{ [key: number]: string }>({});  // ← ИЗМЕНЕНО на string
    const [imageUrl, setImageUrl] = useState<{ [key: number]: string }>({});
    const [genre, setGenre] = useState<{ [key: number]: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchAllInfo = async () => {
            if (music.length === 0) return;

            setIsLoading(true);
            const newDuration: { [key: number]: string } = {};
            const newImages: { [key: number]: string } = {};
            const newGenre: { [key: number]: string } = {};

            await Promise.all(
                music.map(async (track, index) => {
                    try {
                        const res = await fetch(
                            `/api/track-info?artist=${encodeURIComponent(track.artist)}&track=${encodeURIComponent(track.name)}`
                        );
                        const data = await res.json();

                        const tags = data.track?.toptags?.tag;
                        newGenre[index] = tags && tags.length > 0 ? tags[0].name : "Unknown";

                        newDuration[index] = formatDuration(data.track?.duration);

                        const imageArray = data.track?.album?.image;
                        if (imageArray) {
                            const imageObj = imageArray.find((img: any) => img.size === 'extralarge');
                            newImages[index] = imageObj?.['#text'] || '';
                        }
                    } catch (error) {
                        console.error("Ошибка загрузки трека:", error);
                        newDuration[index] = "--:--";
                        newGenre[index] = "Unknown";
                    }
                })
            );

            setDuration(newDuration);
            setImageUrl(newImages);
            setGenre(newGenre);
            setIsLoading(false);
        };

        fetchAllInfo();
    }, [music]);

    return { duration, imageUrl, genre, isLoading };
};

//^ ХУК ДЛЯ ПОЛУЧЕНИЯ ДОП. ИНФОРМАЦИИ О ТРЕКАХ