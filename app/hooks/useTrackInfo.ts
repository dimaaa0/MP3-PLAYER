import { useState, useEffect } from 'react';
import { UseTrackToReturn, Track } from '../types/types';

const formatDuration = (duration: string | number): string => {
    let num = typeof duration === 'string' ? parseInt(duration) : duration;
    if (!num || isNaN(num)) return '--:--';

    const isMilliseconds = num > 10000;

    if (isMilliseconds) {
        num = Math.floor(num / 1000);
    }

    const minutes = Math.floor(num / 60);
    const seconds = num % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};


export const useTrackInfo = (music: Track[]): UseTrackToReturn => {
    const [duration, setDuration] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState<string[]>([]);
    const [genre, setGenre] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchAllInfo = async () => {
            if (music.length === 0) {
                if (duration.length !== 0) setDuration([]);
                if (imageUrl.length !== 0) setImageUrl([]);
                if (genre.length !== 0) setGenre([]);
                return;
            }

            setIsLoading(true);
            const newDuration: string[] = [];
            const newImages: string[] = [];
            const newGenre: string[] = [];

            await Promise.all(
                music.map(async (track, index) => {
                    try {
                        const artistName = typeof track.artist === 'string'

                            ? track.artist
                            : track.artist.name;

                        const res = await fetch(
                            `/api/track-info?artist=${encodeURIComponent(artistName)}&track=${encodeURIComponent(track.name)}`
                        );
                        const data = await res.json();

                        const tags = data.track?.toptags?.tag;
                        newGenre[index] = tags && tags.length > 0 ? tags[0].name : "Unknown";

                        newDuration[index] = formatDuration(data.track?.duration);

                        const imageArray = data.track?.album?.image;
                        if (imageArray && imageArray.length > 0) {
                            const imageObj = imageArray.find((img: any) => img.size === 'extralarge')
                                || imageArray.find((img: any) => img.size === 'large')
                                || imageArray[imageArray.length - 1];
                            newImages[index] = imageObj?.['#text'] || '';
                        } else {
                            newImages[index] = '';
                        }
                    } catch (error) {
                        console.error("Ошибка загрузки трека:", error);
                        newDuration[index] = "--:--";
                        newGenre[index] = "Unknown";
                        newImages[index] = '';
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