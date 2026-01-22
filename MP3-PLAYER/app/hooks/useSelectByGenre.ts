import { useEffect, useState } from 'react'
import { Track } from '../types/types';

interface StationData {
    tracks: Track[];
}



export function useSelectByGenre(genre: string) {
    const [data, setData] = useState<StationData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!genre) return;

        const fetchData = () => {
            setIsLoading(true);
            setError(null);

            void fetch(`/api/search-by-genre?genre=${encodeURIComponent(genre)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    setData(data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error("Ошибка при получении станций по жанру:", error);
                    setError(error.message || "Неизвестная ошибка");
                    setIsLoading(false);
                });
        };

        fetchData();
    }, [genre]);

    return { data, isLoading, error };
}