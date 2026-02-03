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

    const formatDuration = (duration: string | number): string => {
        const num = typeof duration === 'string' ? parseInt(duration, 10) : Number(duration);
        if (!Number.isFinite(num)) return '--:--';
        const seconds = num > 10000 ? Math.floor(num / 1000) : Math.floor(num);
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    const playTimer = (duration: number) => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        setTimer(0); // Сбрасываем счётчик

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

    const [seconds, setSeconds] = useState(0)

    useEffect(() => {
        const channel = new BroadcastChannel('music_player_channel');
        channelRef.current = channel;


        channel.onmessage = (event) => {
            if (event.data.type === 'TRACK_UPDATE') {
                console.log('TRACK_UPDATE received:', event.data.track); // Для отладки
                console.log('Пройденое время:' + timer);
                if (event.data.track) {
                    playTimer(100)
                    setTrack(event.data.track);
                    setPreviousTrack(event.data.track);
                } else {
                    setTrack(previousTrack);
                }
            } else if (event.data.type === 'PLAY_TRACK') {
                const t = event.data.track;
                if (t?.name && t?.artist) {
                    playTrack(t.name, t.artist, t.imageUrl);
                    setSeconds(t.duration)
                }
            } else if (event.data.type === 'STOP_TRACK') {
                setSeconds(timer);
                stopPlayback();
            }
        };

        channel.postMessage({ type: 'REQUEST_CURRENT_TRACK' });

        document.title = "Music Player";

        return () => channel.close();
    }, []);

    const isPlaying = !!track?.isPlaying;

    if (!track) {
        return (
            <div className="h-screen w-screen bg-[#121212] flex items-center justify-center text-gray-500 p-6 text-center">
                <p className="animate-pulse text-xs uppercase tracking-widest">Ожидание выбора трека...</p>
            </div>
        );
    }


    {/*


const stopTimer = () => {
    if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
    }
};

const resetTimer = () => {
    stopTimer();
    setTimer(0);
};

useEffect(() => {
    return () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };
}, []);

    */}


    const logTheData = (title: string, artist: string, imageUrl: string, duration: number) => {
        console.log('Star button clicked! Track Info:', { title, artist, imageUrl, duration });
    }


    return (
        <div className="h-screen w-screen bg-[#121212] text-white flex flex-col p-8 overflow-hidden relative select-none">

            <div className="absolute inset-0 opacity-20 pointer-events-none transform scale-150">
                {track.imageUrl ? <img src={track.imageUrl} className="w-full h-full object-cover blur-3xl" alt="" /> : null}
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
                        <span className='text-red-400'>    {seconds}</span>
                    </p>

                </div>

                <div className="mt-auto flex w-full justify-center items-center pb-2"> {/* КНОПКИ В MP3 */}
                    <button className="p-2  absolute left-0 hover:bg-white/5 cursor-pointer rounded-full transition-colors group">
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
                                    // Optimistic update so UI responds immediately
                                    setTrack((prev: any) => ({ ...prev, isPlaying: true, isLoadingVideo: true }));
                                    playTrack(track.name, track.artist, track.imageUrl);
                                    channelRef.current?.postMessage({ type: 'PLAY_TRACK', track: { name: track.name, artist: track.artist, imageUrl: track.imageUrl } });
                                }}
                            >
                                {track.isLoadingVideo ? (
                                    <Loader2 className="w-8 h-8 duration-300 animate-spin" />
                                ) : (
                                    <Play className="w-8 h-8" />
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
                                    // Optimistic update for immediate UI response
                                    setTrack((prev: any) => ({ ...prev, isPlaying: false }));
                                    stopPlayback();
                                    channelRef.current?.postMessage({ type: 'STOP_TRACK', track: { name: track.name, artist: track.artist } });
                                }}
                            >
                                {track.isLoadingVideo ? (
                                    <Loader2 className="w-8 h-8 duration-300 animate-spin" />
                                ) : (
                                    <Pause className="w-8 h-8" />
                                )}
                            </button>

                        )}

                        <button className="p-2 hover:bg-white/5 cursor-pointer rounded-full transition-colors group">
                            <SkipForward className=" duration-300 w-7 h-7 group-active:scale-90 transition-transform" />
                        </button>
                    </div>
                    <button className="p-2 absolute right-0 hover:bg-white/5 cursor-pointer rounded-full transition-colors group">
                        <Star className='w-7 h-7 '
                            onClick={() => logTheData(
                                track.name,
                                track.artist,
                                track.imageUrl,
                                track.duration
                            )}
                        />
                    </button>
                </div>
                {track.duration != null && (
                    <>
                        <div className='w-full h-2 bg-gray-700 rounded-full mt-4'>
                            <div className='h-full bg-white rounded-full w-[5%]'></div>
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