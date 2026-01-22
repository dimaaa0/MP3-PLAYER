import { useState } from 'react';

interface PlayingTrack {
    name: string;
    artist: string;
}

export const useYoutubePlayer = () => {
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
    const [currentTrack, setCurrentTrack] = useState<PlayingTrack | null>(null);
    const [isLoadingVideo, setIsLoadingVideo] = useState(false);

    const playTrack = async (trackName: string, artistName: string) => {
        if (currentTrack?.name === trackName && currentTrack?.artist === artistName) return;

        setIsLoadingVideo(true);
        try {
            const response = await fetch(
                `/api/audio?artist=${encodeURIComponent(artistName)}&track=${encodeURIComponent(trackName)}`
            );
            const data = await response.json();

            if (data.videoId) {
                setActiveVideoId(data.videoId);
                setCurrentTrack({ name: trackName, artist: artistName });
            } else {
                console.error("Video ID not found");
            }
        } catch (error) {
            console.error("Error fetching YouTube video:", error);
        } finally {
            setIsLoadingVideo(false);
        }
    };

    const stopPlayback = () => {
        setActiveVideoId(null);
        setCurrentTrack(null);
    };

    return {
        activeVideoId,
        currentTrack,
        isLoadingVideo,
        playTrack,
        stopPlayback
    };
};