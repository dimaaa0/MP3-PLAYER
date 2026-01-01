"use client";

import { Star, Settings } from 'lucide-react';
import { Track } from '../types/types';
import { useState, useEffect } from 'react';

interface HeaderProps {
    music: Track[];
}

const MusicList = ({ music }: HeaderProps) => {
    const [durations, setDurations] = useState<{ [key: number]: string }>({});
    const [imageUrls, setImageUrls] = useState<{ [key: number]: string }>({});

    const formatDuration = (ms: string | number | undefined) => {
        if (!ms || ms === "0") return "--:--";
        const totalSeconds = Math.floor(Number(ms) / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    useEffect(() => {  //^ ПОИСК ВРЕМЕНИ И ДЛИТЕЛЬНОСТЬ
        const fetchAllInfo = async () => {
            const newDurations: { [key: number]: string } = {};
            const newImages: { [key: number]: string } = {};

            await Promise.all(
                music.map(async (track, index) => {
                    try {
                        const res = await fetch(
                            `/api/track-info?artist=${encodeURIComponent(track.artist)}&track=${encodeURIComponent(track.name)}`
                        );
                        const data = await res.json();

                        newDurations[index] = formatDuration(data.track?.duration);

                        const imageArray = data.track?.album?.image;
                        if (imageArray) {
                            console.log(imageArray);

                            const imageObj = imageArray.find((img: any) => img.size === 'extralarge');
                            newImages[index] = imageObj?.['#text'] || '';
                        }
                    } catch (error) {
                        console.error("Ошибка загрузки трека:", error);
                        newDurations[index] = "--:--";
                    }
                })
            );

            setDurations(newDurations);
            setImageUrls(newImages); 
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
                        <div className="w-16 h-16 flex-shrink-0">
                            {imageUrls[index] ? (
                                <img
                                    src={imageUrls[index]}
                                    alt="Cover"
                                    className="w-full h-full object-cover rounded-md"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-700 animate-pulse rounded-md flex items-center justify-center text-[10px] text-gray-400">
                                    No Cover
                                </div>
                            )}
                        </div>

                        <div className="name flex flex-col gap-1 justify-center">
                            <h1 className="text-sm font-bold">{track.name}</h1>
                            <h3 className="text-xs text-gray-400">{track.artist}</h3>
                        </div>
                    </div>

                    <div className="details flex items-center justify-center gap-2">
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