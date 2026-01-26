"use client";

import { Star, Settings, Play, Pause, Loader2 } from 'lucide-react';
import { Track, favoritesType, MusicListProps } from '../types/types';
import { useState, useEffect, useCallback } from 'react';
import { useTrackInfo } from '../hooks/useTrackInfo';
import { useTopTracks } from '../hooks/useTopTracks';
import { useSelectByGenre } from '../hooks/useSelectByGenre';
import { useYoutubePlayer } from '../hooks/useYoutubePlayer';

const MusicList = ({ music, inputValue, recentCategory }: MusicListProps) => {
    const [favorites, setFavorites] = useState<favoritesType[]>([]);
    const { activeVideoId, currentTrack, isLoadingVideo, playTrack, stopPlayback } = useYoutubePlayer();

    const { tracks, loading } = useTopTracks();
    const selectByGenre = useSelectByGenre(recentCategory || 'All');

    const trendData = useTrackInfo(tracks?.tracks?.track || []);
    const searchData = useTrackInfo(music || []);
    const genreData = useTrackInfo(selectByGenre.data?.tracks || []);

    // Функция отправки состояния в канал
    const broadcastTrackUpdate = useCallback((channel: BroadcastChannel) => {
        if (currentTrack) {
            channel.postMessage({
                type: 'TRACK_UPDATE',
                track: {
                    name: currentTrack.name,
                    artist: currentTrack.artist,
                    imageUrl: currentTrack.imageUrl,
                    isLoadingVideo: isLoadingVideo
                }
            });
        }
    }, [currentTrack, isLoadingVideo]);

    // Эффект для синхронизации и ответов на запросы
    useEffect(() => {
        const channel = new BroadcastChannel('music_player_channel');

        // Отправляем обновление при изменении трека
        broadcastTrackUpdate(channel);

        // Слушаем запросы от "новоприбывших" окон
        channel.onmessage = (event) => {
            if (event.data.type === 'REQUEST_CURRENT_TRACK') {
                broadcastTrackUpdate(channel);
            }
        };

        return () => channel.close();
    }, [currentTrack, isLoadingVideo, broadcastTrackUpdate]);

    const handlePopOut = () => {
        const width = 400;
        const height = 500;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const features = [
            `width=${width}`, `height=${height}`, `left=${left}`, `top=${top}`,
            'popup=yes', 'resizable=no', 'scrollbars=no'
        ].join(',');

        window.open('/pages/mini-player', 'MusicStreamPlayer', features);
        // Сообщение уйдет через useEffect, как только окно сделает запрос
    };

    const TrackRow = ({ name, artist, imageUrl, duration, isLoading }: any) => {
        const isCurrentActive = currentTrack?.name === name && currentTrack?.artist === artist;

        return (
            <div
                onClick={() => handlePopOut()}
                className={`cursor-pointer card rounded-lg flex justify-between w-full p-3.5 transition-colors ${isCurrentActive ? 'bg-[#7776766d] ring-1 ring-blue-500' : 'bg-[#7776763b] hover:bg-[#7776765d]'
                    } text-white`}
            >
                <div className="title flex gap-6 items-center">
                    <div className="relative w-16 h-16 shrink-0 flex items-center justify-center bg-gray-700 rounded-md overflow-hidden group">
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-t-blue-500 rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <img src={imageUrl} alt="Cover" className={`w-full h-full object-cover ${isCurrentActive ? 'opacity-50' : ''}`} />
                                <div className={`absolute inset-0 flex items-center justify-center ${isCurrentActive ? 'flex' : 'hidden group-hover:flex'}`}>
                                    {isCurrentActive && isLoadingVideo ? (
                                        <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                                    ) : isCurrentActive ? (
                                        <Pause className="w-6 h-6 text-white fill-white z-10"
                                            onClick={(e) => { e.stopPropagation(); stopPlayback(); }} />
                                    ) : (
                                        <Play className="w-6 h-6 text-white fill-white"
                                            onClick={(e) => { e.stopPropagation(); playTrack(name, artist, imageUrl); }} />
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    <div className="name flex flex-col justify-center">
                        <h1 className={`text-sm font-bold line-clamp-1 ${isCurrentActive ? 'text-blue-400' : ''}`}>{name}</h1>
                        <h3 className="text-xs text-gray-400">{artist}</h3>
                    </div>
                </div>
                <div className="details flex items-center gap-2 text-sm">
                    {duration}
                </div>
            </div>
        );
    };

    return (
        <div className='flex flex-col gap-3 pb-24'>
            {/* Рендер списка треков (упрощено для примера) */}
            {tracks?.tracks?.track.map((track: any, index: number) => (
                <TrackRow
                    key={index}
                    name={track.name}
                    artist={track.artist.name}
                    imageUrl={trendData.imageUrl[index]}
                    duration="3:45"
                />
            ))}

            {activeVideoId && (
                <div className="hidden"><iframe src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`} allow="autoplay"></iframe></div>
            )}
        </div>
    );
};

export default MusicList;