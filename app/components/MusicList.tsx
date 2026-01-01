"use client";

import { Star, Settings } from 'lucide-react';
import { Track } from '../types/types';
import { useState, useEffect } from 'react';

interface HeaderProps {
    music: Track[];
}

const MusicList = ({ music }: HeaderProps) => {
        const [durations, setDurations] = useState<{ [key: number]: string }>({});

        const formatDuration = (ms: string | number | undefined) => {
            if (!ms || ms === "0") return "--:--";
            const totalSeconds = Math.floor(Number(ms) / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        };

        useEffect(() => {
            const fetchAllInfo = async () => {
                const newDurations: { [key: number]: string } = {};

                await Promise.all(
                    music.map(async (track, index) => {
                        try {
                            const res = await fetch(
                                `/api/track-info?artist=${encodeURIComponent(track.artist)}&track=${encodeURIComponent(track.name)}`
                            );
                            const data = await res.json();
                            newDurations[index] = formatDuration(data.track?.duration);
                        } catch (error) {
                            console.error("Ошибка загрузки трека:", error);
                            newDurations[index] = "-- : --";
                        }
                    })
                );

                setDurations(newDurations);
            };

            if (music.length > 0) {
                fetchAllInfo();
            }
        }, [music]);

    return (
        <div className='flex flex-col gap-3'>
            {music.map((track, index) => (
                <div key={index} className="cursor-pointer card font-fr rounded-lg flex justify-between w-full p-3.5 bg-[#7776763b] text-white hover:bg-[#7776765d] transition-colors">
                    <div className="title flex gap-6">
                        {/* Здесь можно добавить картинку, если прокинешь её в API */}
                        <div className="bg-black w-16 h-16 rounded-md"></div>
                        <div className="name flex flex-col gap-2 justify-center">
                            <h1 className="text-sm font-bold">{track.name}</h1>
                            <h3 className="text-xs text-gray-400">{track.artist}</h3>
                        </div>
                    </div>

                    <div className="details flex items-center justify-center gap-2">
                        {/* Выводим данные из нашего state */}
                        <h3 className="text-sm tabular-nums mr-2">
                            {durations[index] || "..."}
                        </h3>
                        <Star className='w-4.5 h-4.5 cursor-pointer hover:text-yellow-400 transition-colors' />
                        <Settings className='w-4.5 h-4.5 cursor-pointer hover:text-gray-300 transition-colors' />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MusicList;