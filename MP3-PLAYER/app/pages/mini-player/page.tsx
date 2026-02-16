"use client";
import { useEffect, useState, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Loader2, Star, HeartOff } from 'lucide-react';
import { useYoutubePlayer } from '../../hooks/useYoutubePlayer';

export default function MiniPlayer() {
    const [track, setTrack] = useState<any>(null);
    const [previousTrack, setPreviousTrack] = useState<any>(null);
    const { playTrack, stopPlayback } = useYoutubePlayer();
    const channelRef = useRef<BroadcastChannel | null>(null);
    const [active, setActive] = useState(true);
    const [timer, setTimer] = useState<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [isFavorited, setIsFavorited] = useState(false);
    const [favorites, setFavorites] = useState<any[]>([]);
    const [seconds, setSeconds] = useState(0);

    const formatDuration = (duration: string | number): string => {
        const num = typeof duration === 'string' ? parseInt(duration) : duration;
        if (!num || isNaN(num))
            return '--:--';

        const seconds = num > 10000 ? Math.floor(num / 1000) : num;

        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const playTimer = (duration: number) => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        setTimer(0);

        timerRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev >= duration) {
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                    }
                    return duration;
                }
                return prev + 1;
            });
        }, 1000);
    };

    useEffect(() => {
        const channel = new BroadcastChannel('music_player_channel');
        channelRef.current = channel;

        channel.onmessage = (event) => {
            if (event.data.type === 'TRACK_UPDATE') {
                console.log('TRACK_UPDATE received:', event.data.track);
                if (event.data.track) {
                    setTrack(event.data.track);
                    setPreviousTrack(event.data.track);

                } else {
                    setTrack(previousTrack);
                }
            } else if (event.data.type === 'PLAY_TRACK') {
                const t = event.data.track;
                if (t?.name && t?.artist) {
                    playTrack(t.name, t.artist, t.imageUrl);
                }
            } else if (event.data.type === 'FAVORITES_UPDATE') {
                console.log('FAVORITES_UPDATE received:', event.data.favorites);
                setFavorites(event.data.favorites);

            }
        };

        channel.postMessage({ type: 'REQUEST_CURRENT_TRACK' });
        document.title = "Music Player";

        return () => channel.close();
    }, [favorites, isFavorited]);

    useEffect(() => {
        if (track && favorites.length > 0) {
            const isFav = favorites.some((fav: any) =>
                fav.name === track.name && fav.artist === track.artist
            );
            setIsFavorited(isFav);
        } else if (track && favorites.length === 0) {
            setIsFavorited(false);
        }
    }, [track, favorites]);

    const logTheData = (title: string, artist: string, imageUrl: string, duration: number) => {
        console.log('Star button clicked! Track Info:', { title, artist, imageUrl, duration });
    };

    const handleAddFavorite = (title: string, artist: string, imageUrl: string, duration: string) => {
        console.log('handleAddFavorite called with:', { title, artist, imageUrl, duration });
        setIsFavorited(!isFavorited);
        const message = {
            type: 'ADD_FAVORITE',
            track: {
                name: title,
                artist: artist,
                imageUrl: imageUrl,
                duration: formatDuration(duration)
            }
        };
        console.log('Sending message:', message);
        channelRef.current?.postMessage(message);
    };

    const isPlaying = !!track?.isPlaying;

    if (!track) {
        return (
            <div className="h-screen w-screen bg-[#121212] flex items-center justify-center text-gray-500 p-6 text-center">
                <p className="animate-pulse text-xs uppercase tracking-widest">Ожидание выбора трека...</p>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen bg-[#121212] text-white flex flex-col p-8 overflow-hidden relative select-none">
            <div className="absolute inset-0 opacity-40 pointer-events-none transform scale-150">
                {track.imageUrl ? <img src={track.imageUrl} className="w-full h-full object-cover blur-[80px]" alt="" /> : null}
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="w-full aspect-square rounded-lg overflow-hidden mb-4">
                    {track.imageUrl ? (
                        <img
                            src={track.imageUrl}
                            alt="Track cover"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                            <span className="text-white text-lg font-medium">NO COVER</span>
                        </div>
                    )}
                </div>

                <div className="space-y-0.5 mb-4">
                    <h1 className="text-xl font-bold truncate tracking-tight text-blue-50">
                        {track.name}
                    </h1>
                    <p className="text-white-100 text-sm font-medium truncate uppercase tracking-wider">
                        {track.artist}
                    </p>
                </div>

                <div className="mt-auto flex w-full justify-center items-center pb-2">
                    <button className="p-2 absolute left-0 hover:bg-white/5 cursor-pointer rounded-full transition-colors group">
                        <HeartOff className='w-7 h-7' />
                    </button>
                    <div className='flex items-center justify-between w-50'>
                        <button className="p-2 hover:bg-white/5 cursor-pointer rounded-full transition-colors group">
                            <SkipBack className="cursor-pointer duration-300 w-7 h-7 group-active:scale-90 transition-transform" />
                        </button>

                        {!isPlaying ? (
                            <button
                                title="Play"
                                aria-label="Play"
                                disabled={track.isLoadingVideo}
                                className={`w-16 h-16 rounded-full cursor-pointer flex items-center justify-center 
                   bg-white/1 backdrop-blur-md border border-white/1 
                   text-white shadow-xl shadow-black/40
                   transition-all duration-300 ease-out
                   hover:bg-white/5 transition-8000ms ${track.isLoadingVideo ? 'opacity-60 pointer-events-none' : ''}`}
                                onClick={() => {
                                    setTrack((prev: any) => ({ ...prev, isPlaying: true, isLoadingVideo: true }));
                                    playTrack(track.name, track.artist, track.imageUrl);
                                    channelRef.current?.postMessage({ type: 'PLAY_TRACK', track: { name: track.name, artist: track.artist, imageUrl: track.imageUrl } });
                                }}
                            >
                                {track.isLoadingVideo ? (
                                    <Loader2 className="w-8 h-8 duration-300 animate-spin" />
                                ) : (
                                    <Play className="w-8 h-8"
                                        onClick={() => {
                                            setTrack((prev: any) => ({ ...prev, isPlaying: true, isLoadingVideo: true }));
                                            playTrack(track.name, track.artist, track.imageUrl);
                                            channelRef.current?.postMessage({ type: 'PLAY_TRACK', track: { name: track.name, artist: track.artist, imageUrl: track.imageUrl } });
                                        }}
                                    />
                                )}
                            </button>
                        ) : (
                            <button
                                title="Pause"
                                aria-label="Pause"
                                className="w-16 h-16 rounded-full cursor-pointer flex items-center justify-center 
                   bg-white/1 backdrop-blur-md border border-white/1 
                   text-white shadow-xl shadow-black/40
                   transition-all duration-300 ease-out
                   hover:bg-white/5 transition-8000ms"
                                onClick={() => {
                                    setTrack((prev: any) => ({ ...prev, isPlaying: false }));
                                    stopPlayback();
                                    channelRef.current?.postMessage({ type: 'STOP_TRACK', track: { name: track.name, artist: track.artist } });
                                }}
                            >
                                {track.isLoadingVideo ? (
                                    <Loader2 className="w-8 h-8 duration-300 animate-spin" />
                                ) : (
                                    <Pause className="w-8 h-8"
                                        onClick={() => {
                                            setTrack((prev: any) => ({ ...prev, isPlaying: false }));
                                            stopPlayback();
                                            channelRef.current?.postMessage({ type: 'STOP_TRACK', track: { name: track.name, artist: track.artist } });
                                        }}
                                    />
                                )}
                            </button>
                        )}

                        <button className="p-2 hover:bg-white/5 cursor-pointer rounded-full transition-colors group">
                            <SkipForward className="duration-300 w-7 h-7 group-active:scale-90 transition-transform" />
                        </button>
                    </div>
                    <button
                        className="p-2 absolute right-0 hover:bg-white/5 cursor-pointer rounded-full transition-colors group"
                        onClick={() => handleAddFavorite(
                            track.name,
                            track.artist,
                            track.imageUrl,
                            track.duration
                        )}
                    >
                        <Star className={`w-7 h-7 transition-all ${isFavorited ? 'text-yellow-400 fill-yellow-400 scale-110' : ''}`} />
                    </button>
                </div>
                {track.duration != null && (
                    <>
                        <div className='w-full h-1 bg-white/40 rounded-full mt-4'>
                            <div className='h-full bg-white rounded-full w-[30%] flex justify-end items-center '>
                                <div className='progress-bar-tracker w-2.5 h-2.5 bg-white rounded-2xl absolute'></div>
                            </div>
                        </div>
                        <div className='flex justify-between mt-1'>
                            <h3>00:02</h3>
                            <h3>{formatDuration(track.duration)}</h3>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}