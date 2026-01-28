"use client";
import { useEffect, useState, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Loader2, Star, HeartOff } from 'lucide-react';
import { useYoutubePlayer } from '../../hooks/useYoutubePlayer';

export default function MiniPlayer() {
    const [track, setTrack] = useState<any>(null);
    const [previousTrack, setPreviousTrack] = useState<any>(null);
    const { playTrack, stopPlayback } = useYoutubePlayer();
    const channelRef = useRef<BroadcastChannel | null>(null);



    useEffect(() => {
        const channel = new BroadcastChannel('music_player_channel');
        channelRef.current = channel;

        // 1. Слушаем ответы
        channel.onmessage = (event) => {
            if (event.data.type === 'TRACK_UPDATE') {
                if (event.data.track) {
                    setTrack(event.data.track);
                    setPreviousTrack(event.data.track);
                } else {
                    setTrack(previousTrack);
                }

            }
        };

        channel.postMessage({ type: 'REQUEST_CURRENT_TRACK' });

        document.title = "Music Player";

        return () => channel.close();
    }, []);

    if (!track) {
        return (
            <div className="h-screen w-screen bg-[#121212] flex items-center justify-center text-gray-500 p-6 text-center">
                <p className="animate-pulse text-xs uppercase tracking-widest">Ожидание выбора трека...</p>
            </div>
        );
    }

    {/*
const [timer, setTimer] = useState<number>(0);
const timerRef = useRef<NodeJS.Timeout | null>(null);

const playTimer = (duration: number) => {
    // Очищаем предыдущий таймер если есть
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

// Не забудь очистить при размонтировании
useEffect(() => {
    return () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };
}, []);
    */}


    return (
        <div className="h-screen w-screen bg-[#121212] text-white flex flex-col p-8 overflow-hidden relative select-none">

            <div className="absolute inset-0 opacity-20 pointer-events-none transform scale-150">
                {track.imageUrl ? <img src={track.imageUrl} className="w-full h-full object-cover blur-3xl" alt="" /> : null}
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="aspect-square w-full mb-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden border border-white/5">

                    <img src={track.imageUrl} alt="Cover" className=" w-full h-full object-cover" />

                </div>

                <div className="space-y-0.5 mb-4">
                    <h1 className="text-xl font-bold truncate tracking-tight text-blue-50">
                        {track.name}
                    </h1>
                    <p className="text-blue-400/80 text-sm font-medium truncate uppercase tracking-wider">
                        {track.artist}
                    </p>

                </div>

                <div className="mt-auto flex w-full justify-center items-center pb-2"> {/* КНОПКИ В MP3 */}
                    <button className="p-2  absolute left-0 hover:bg-white/5 cursor-pointer rounded-full transition-colors group">
                        <HeartOff className='w-7 h-7' />
                    </button>
                    <div className='flex items-center justify-between w-[200px]'>
                        <button className="p-2 hover:bg-white/5 cursor-pointer rounded-full transition-colors group">
                            <SkipBack className="cursor-pointer duration-300 w-7 h-7 group-active:scale-90 transition-transform" />
                        </button>

                        <button className="w-16 h-16 cursor-pointer duration-300 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">
                            {track.isLoadingVideo ? (
                                <Loader2 className="w-8 h-8  duration-300 animate-spin" />
                            ) : (
                                <Pause className=" w-8 h-8 fill-current  duration-300 ml-0"
                                    onClick={() => { channelRef.current?.postMessage({ type: 'STOP_TRACK' }); }}
                                />

                            )}
                        </button>

                        <button className="p-2 hover:bg-white/5 cursor-pointer rounded-full transition-colors group">
                            <SkipForward className=" duration-300 w-7 h-7 group-active:scale-90 transition-transform" />
                        </button>
                    </div>
                    <button className="p-2 absolute right-0 hover:bg-white/5 cursor-pointer rounded-full transition-colors group">
                        <Star className='w-7 h-7 ' />
                    </button>
                </div>

                <div className='w-full h-2 bg-gray-700 rounded-full mt-4'> {/* строка прогресса воспроизведения */}

                    <div className='h-full bg-white rounded-full w-[5%]'></div>
                </div>
                <div className='flex justify-between mt-1'> {/* Время воспроизведения справа */}
                    <h3>00:02</h3>
                    <h3>02:25</h3>
                </div>
            </div>
        </div>
    );
}



