import { useState, useRef } from 'react';
import { PlayingTrack } from '../types/types';


export const useYoutubePlayer = () => {
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
    const [currentTrack, setCurrentTrack] = useState<PlayingTrack | null>(null);
    const [isLoadingVideo, setIsLoadingVideo] = useState(false);
    const loadingRef = useRef(false);

    const playTrack = async (trackName: string, artistName: string, imageUrl: string) => {
        // Prevent concurrent requests
        if (loadingRef.current) return;
        if (currentTrack?.name === trackName && currentTrack?.artist === artistName) return;

        loadingRef.current = true;
        setIsLoadingVideo(true);
        try {
            const response = await fetch(
                `/api/audio?artist=${encodeURIComponent(artistName)}&track=${encodeURIComponent(trackName)}`
            );
            const data = await response.json();

            if (data.videoId) {
                setActiveVideoId(data.videoId);
                setCurrentTrack({ name: trackName, artist: artistName, imageUrl, duration: data.duration });
            } else {
                console.error("Video ID not found");
            }
        } catch (error) {
            console.error("Error fetching YouTube video:", error);
        } finally {
            loadingRef.current = false;
            setIsLoadingVideo(false);
        }
    };

    const stopPlayback = () => {
        setActiveVideoId(null);
        setCurrentTrack(null);
        console.log('the track is stopped');
    };

    return {
        activeVideoId,
        currentTrack,
        isLoadingVideo,
        playTrack,
        stopPlayback
    };
};