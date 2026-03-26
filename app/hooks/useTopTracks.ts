import { useEffect, useState } from 'react';
import { TopTracksResponseType } from '../types/types';

export function useTopTracks() {
    const [tracks, setTracks] = useState<TopTracksResponseType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/top-tracks')
            .then(res => res.json())
            .then(data => {
                setTracks(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, []);

    return { tracks, loading, error };
}