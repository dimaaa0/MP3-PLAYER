"use client";
import { useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Loader2 } from 'lucide-react';
import { useYoutubePlayer } from '../../hooks/useYoutubePlayer';

export default function MiniPlayer() {
    const [track, setTrack] = useState<any>(null);
    const [previousTrack, setPreviousTrack] = useState<any>(null);
    const { playTrack, stopPlayback } = useYoutubePlayer();

    useEffect(() => {
        const channel = new BroadcastChannel('music_player_channel');

        // 1. Слушаем ответы
        channel.onmessage = (event) => {
            if (event.data.type === 'TRACK_UPDATE') {
                setTrack(event.data.track);
                // setPreviousTrack(track); // Будь осторожен, здесь track может быть старым из замыкания
            }
        };

        // 2. АКТИВНЫЙ ШАГ: Спрашиваем основную вкладку: "Что сейчас играет?"
        channel.postMessage({ type: 'REQUEST_CURRENT_TRACK' });

        document.title = "Music Player";

        return () => channel.close();
    }, []);
    //^ КОРОЧЕ НАДО СДЕЛАТЬ ТАК ЧТОБЫ ДАЖЕ ЕСЛИ НЕ БУДЕТ ТРЕКА, ТО ОНО НЕ ПИСАЛО "Ожидание выбора трека..." А ПОКАЗЫВАЛО ПРЕДЫДУЩИЙ ТРЕК!!!!!!!!
    //^ А ЩАС КАКАЯ-ТО ХУЙНЯ ЧТО ВООБЩЕ НЕ ПОКАЗЫВАЕТ НИЧЕГО ИЗ-ЗА ВРОДЕ БЫ previousTrack, СКОРЕЕ ВСЕГО ИЗ-ЗА 26 СТРОКИ 
    console.log(previousTrack);

    if (!track) {
        return (
            <div className="h-screen w-screen bg-[#121212] flex items-center justify-center text-gray-500 p-6 text-center">
                <p className="animate-pulse text-xs uppercase tracking-widest">Ожидание выбора трека...</p>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen bg-[#121212] text-white flex flex-col p-8 overflow-hidden relative select-none">
            <div className="absolute inset-0 opacity-20 pointer-events-none transform scale-150">
                <img src={track.imageUrl} className="w-full h-full object-cover blur-3xl" alt="" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="aspect-square w-full mb-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden border border-white/5">

                    <img src={track.imageUrl} alt="Cover" className=" w-full h-full object-cover" />

                </div>

                <div className="space-y-1 mb-6">
                    <h1 className="text-xl font-bold truncate tracking-tight text-blue-50">
                        {track.name}
                    </h1>
                    <p className="text-blue-400/80 text-sm font-medium truncate uppercase tracking-wider">
                        {track.artist}
                    </p>
                </div>

                <div className="mt-auto flex justify-between items-center pb-2">
                    <button className="p-2 hover:bg-white/5 rounded-full transition-colors group">
                        <SkipBack className="cursor-pointer w-6 h-6 group-active:scale-90 transition-transform" />
                    </button>

                    <button className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">
                        {track.isLoadingVideo ? (
                            <Loader2 className="w-8 h-8 animate-spin" />
                        ) : (
                            <Pause className="cursor-pointer w-8 h-8 fill-current ml-0" onClick={stopPlayback} />
                        )}
                    </button>

                    <button className="p-2 hover:bg-white/5 rounded-full transition-colors group">
                        <SkipForward className="cursor-pointer w-6 h-6 group-active:scale-90 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}

