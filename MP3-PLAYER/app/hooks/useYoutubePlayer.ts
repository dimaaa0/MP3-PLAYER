import { useState, useRef, useCallback, useEffect } from 'react';
import { PlayingTrack } from '../types/types';


export const useYoutubePlayer = () => {
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
    const [currentTrack, setCurrentTrack] = useState<PlayingTrack | null>(null);
    const [isLoadingVideo, setIsLoadingVideo] = useState(false);
    const [volume, setVolume] = useState(70);
    const loadingRef = useRef(false);
    const playerRef = useRef<any>(null);

    // Инициализация YouTube IFrame API
    useEffect(() => {
        // Загружаем YouTube IFrame API
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        tag.async = true;
        tag.defer = true;
        document.head.appendChild(tag);

        return () => {
            // Очистка при размонтировании
            if (tag.parentNode) {
                tag.parentNode.removeChild(tag);
            }
        };
    }, []);

    const playTrack = async (trackName: string, artistName: string, imageUrl: string) => {
        // Предотвращаем повторное воспроизведение одного трека, если он уже играет
        if (currentTrack?.name === trackName && currentTrack?.artist === artistName && activeVideoId) return;

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

    const setVolumeLevel = useCallback((newVolume: number) => {
        setVolume(newVolume);
        // Если player доступен, устанавливаем громкость
        if (playerRef.current && playerRef.current.setVolume) {
            playerRef.current.setVolume(Math.max(0, Math.min(100, newVolume)));
        }
    }, []);

    return {
        activeVideoId,
        currentTrack,
        isLoadingVideo,
        volume,
        setVolumeLevel,
        playerRef,
        playTrack,
        stopPlayback
    };
};