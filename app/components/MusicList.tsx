"use client";

import { Star, Settings } from 'lucide-react';
import { Track, favoritesType } from '../types/types';
import { useState, useEffect } from 'react';
import { useTrackInfo } from '../hooks/useTrackInfo';


interface HeaderProps {
    music: Track[];
}

const MusicList = ({ music }: HeaderProps) => {

    const { duration, imageUrl, genre, isLoading } = useTrackInfo(music);

    const [favorites, setFavorites] = useState<favoritesType[]>([])

    const handleFavorite = (track: any, imageUrl: string, duration: string) => {
        setFavorites((prev) => {
            const isExist = prev.some(item => item.name === track.name && item.artist === track.artist)

            if (isExist) {
                return prev.filter(item => item.name !== track.name || item.artist !== track.artist);
            } else {
                return [...prev, { name: track.name, artist: track.artist, imageUrl, duration }];
            }
        })
    };

    const isFavorite = (name: string, artist: string) => {
        return favorites.some(fav => fav.name === name && fav.artist === artist);
    };

    return (
        <div className='flex flex-col gap-3'>
            <div className="favorites">
                {favorites.length > 0 && (
                    <div className="favorites mb-6">
                        <h1 className="text-xl font-bold mb-4">FAVORITES</h1>
                        <div className='flex flex-col gap-2'>
                            {favorites.map((item) => (
                                <div key={`${item.name}-${item.artist}`}

                                    className="cursor-pointer card rounded-lg flex justify-between w-full p-3.5 bg-[#7776763b] text-white hover:bg-[#7776765d] transition-colors">
                                    <div className="title flex gap-6">
                                        <div className="w-16 h-16 shrink-0 flex items-center justify-center">
                                            {
                                                isLoading ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                                                    </div>
                                                ) : (
                                                    item.imageUrl ? (
                                                        <img src={item.imageUrl} alt="Cover" className="w-full h-full object-cover rounded-md" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-700 animate-pulse rounded-md flex items-center justify-center text-[10px]">No Cover</div>
                                                    )
                                                )
                                            }
                                        </div>
                                        <div className="name flex flex-col justify-center">
                                            {
                                                isLoading ? (
                                                    <div>
                                                        <div className="w-30 h-4 bg-gray-700 animate-pulse rounded-md mb-1"></div>
                                                        <div className="w-16 h-4 bg-gray-700 animate-pulse rounded-md mb-1"></div>
                                                    </div>
                                                ) : (
                                                    <div className='flex flex-col'>
                                                        <h1 className="text-sm font-bold">{item.name}</h1>
                                                        <h3 className="text-xs text-gray-400">{item.artist}</h3>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div className="details flex items-center gap-2">
                                        <h3 className="text-sm tabular-nums mr-2">{item.duration}</h3>
                                        <Star onClick={() => handleFavorite(item, item.imageUrl, item.duration)} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                        <Settings className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <h1>ALL</h1>

            <div className='flex flex-col gap-3'>
                {music.map((track, index) => {
                    const active = isFavorite(track.name, track.artist);

                    return (
                        <div key={index}

                            className="cursor-pointer card rounded-lg flex justify-between w-full p-3.5 bg-[#7776763b] text-white hover:bg-[#7776765d] transition-colors">
                            <div className="title flex gap-6">
                                <div className="w-16 h-16 shrink-0">
                                    {imageUrl[index] ? (
                                        <img src={imageUrl[index]} alt="Cover" className="w-full h-full object-cover rounded-md" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-700 animate-pulse rounded-md flex items-center justify-center text-[10px]">No Cover</div>
                                    )}
                                </div>
                                <div className="name flex flex-col justify-center">
                                    <h1 className="text-sm font-bold">{track.name}</h1>
                                    <h3 className="text-xs text-gray-400">{track.artist}</h3>
                                </div>
                            </div>

                            <div className="details flex items-center gap-2">
                                <h3 className="text-sm tabular-nums mr-2">{duration[index] || "--:--"}</h3>
                                <Star
                                    onClick={() => handleFavorite(track, imageUrl[index], duration[index])}
                                    className={`w-5 h-5 transition-colors ${active ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
                                        }`}
                                />
                                <Settings className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MusicList;