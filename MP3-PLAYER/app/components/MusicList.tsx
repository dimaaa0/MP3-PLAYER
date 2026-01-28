"use client";

import { Star, Settings, Play, Pause, Loader2 } from 'lucide-react'; // Добавил иконки
import { Track, favoritesType, MusicListProps } from '../types/types';
import { useState, useEffect, useCallback } from 'react';
import { useTrackInfo } from '../hooks/useTrackInfo';
import { useTopTracks } from '../hooks/useTopTracks';
import { useSelectByGenre } from '../hooks/useSelectByGenre';
import { useYoutubePlayer } from '../hooks/useYoutubePlayer';

const MusicList = ({ music, inputValue, recentCategory }: MusicListProps) => {
    const [favorites, setFavorites] = useState<favoritesType[]>([]);

    const { activeVideoId, currentTrack, isLoadingVideo, playTrack, stopPlayback } = useYoutubePlayer(); // МУЗЫКАК КОТОРАЯ ИГРАЕТ СЕЙЧАС

    const { tracks, loading } = useTopTracks();
    const selectByGenre = useSelectByGenre(recentCategory || 'All');

    const trendData = useTrackInfo(tracks?.tracks?.track || []);
    const searchData = useTrackInfo(music || []);
    const genreData = useTrackInfo(selectByGenre.data?.tracks || []);

    const formatDuration = (duration: string | number): string => {
        const num = typeof duration === 'string' ? parseInt(duration) : duration;
        if (!num || isNaN(num)) return '--:--';
        const minutes = Math.floor(num / 60);
        const seconds = num % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const formatDurationForMilliseconds = (duration: string | number): string => {
        let num = typeof duration === 'string' ? parseInt(duration) : duration;
        if (!num || isNaN(num)) return '--:--';
        if (num > 10000) num = Math.floor(num / 1000);
        return formatDuration(num);
    };

    const handleFavorite = (trackName: string, artistName: string, imageUrl: string, duration: string) => {
        setFavorites((prev) => {
            const isExist = prev.some(item => item.name === trackName && item.artist === artistName);
            if (isExist) {
                return prev.filter(item => item.name !== trackName || item.artist !== artistName);
            } else {
                return [...prev, { name: trackName, artist: artistName, imageUrl, duration }];
            }
        });
    };

    const isFavorite = (name: string, artist: any) => {
        const artistName = typeof artist === 'string' ? artist : artist?.name;
        return favorites.some(fav => fav.name === name && fav.artist === artistName);
    };



    const broadcastTrackUpdate = useCallback((channel: BroadcastChannel) => {
        if (currentTrack) {
            channel.postMessage({
                type: 'TRACK_UPDATE',
                track: {
                    name: currentTrack.name,
                    artist: currentTrack.artist,
                    ...(currentTrack.imageUrl && { imageUrl: currentTrack.imageUrl }),
                    isLoadingVideo: isLoadingVideo
                }
            });
        }
    }, [currentTrack, isLoadingVideo]);

    useEffect(() => {
        const channel = new BroadcastChannel('music_player_channel');

        broadcastTrackUpdate(channel);

        channel.onmessage = (event) => {
            if (event.data.type === 'REQUEST_CURRENT_TRACK') {
                broadcastTrackUpdate(channel);
            } else if (event.data.type === 'STOP_TRACK') {
                stopPlayback();
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
    };



    const TrackRow = ({
        name,
        artist,
        imageUrl,
        duration,
        isLoading
    }: { name: string, artist: string, imageUrl: string, duration: string, isLoading?: boolean }) => {
        const active = isFavorite(name, artist);
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
                        ) : imageUrl ? (
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
                        ) : (
                            <>
                                <span className="text-[10px]">No Cover</span>
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
                <div className="details flex items-center gap-2">
                    <h3 className="text-sm tabular-nums mr-2">{duration}</h3>
                    <Star
                        onClick={(e) => {
                            e.stopPropagation();
                            handleFavorite(name, artist, imageUrl, duration);
                        }}
                        className={`w-5 h-5 transition-all ${active ? 'text-yellow-400 fill-yellow-400 scale-110' : 'text-gray-400'}`}
                    />
                    <Settings className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                </div>
            </div>
        );
    };

    useEffect(() => {
        const channel = new BroadcastChannel('music_player_channel');

        if (currentTrack) {
            channel.postMessage({
                type: 'TRACK_UPDATE',
                track: {
                    name: currentTrack.name,
                    artist: currentTrack.artist,
                    ...(currentTrack.imageUrl && { imageUrl: currentTrack.imageUrl }),
                    isLoadingVideo: isLoadingVideo
                }
            });
        }

        return () => channel.close();
    }, [currentTrack, isLoadingVideo]);

    return (
        <div className='flex flex-col gap-3 pb-24'>
            {recentCategory === 'Favorites' ? (
                favorites.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {favorites.map((item) => (
                            <TrackRow
                                key={`${item.name}-${item.artist}`}
                                name={item.name}
                                artist={item.artist}
                                imageUrl={item.imageUrl}
                                duration={item.duration}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-8 text-center text-gray-400">No favorite tracks added yet</div>
                )
            ) : music?.length > 0 ? (
                <div className='search flex flex-col gap-3'>
                    <h1 className="text-xl font-bold">SEARCH</h1>
                    {music.map((track, index) => (
                        <TrackRow
                            key={index}
                            name={track.name}
                            artist={typeof track.artist === 'string' ? track.artist : track.artist.name}
                            imageUrl={searchData.imageUrl[index]}
                            duration={searchData.duration[index] || "--:--"}
                            isLoading={searchData.isLoading}
                        />
                    ))}
                </div>
            ) : (
                <div className="All">
                    {(loading || trendData.isLoading) ? (
                        <div className="flex flex-col items-center py-8 gap-4">
                            <div className="relative w-12 h-12">
                                <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 border-l-blue-500 animate-spin"></div>
                            </div>
                            <span className="text-xs font-medium tracking-widest text-gray-500 uppercase animate-pulse">Loading Tracks</span>
                        </div>
                    ) : recentCategory === 'All' ? (
                        <div className="flex flex-col gap-2">
                            {tracks?.tracks?.track.map((track: Track, index: number) => (
                                <TrackRow
                                    key={index}
                                    name={track.name}
                                    artist={track.artist.name}
                                    imageUrl={trendData.imageUrl[index]}
                                    duration={formatDuration(track.duration)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {selectByGenre.data?.tracks.map((track: Track, index: number) => (
                                <TrackRow
                                    key={index}
                                    name={track.name}
                                    artist={typeof track.artist === 'string' ? track.artist : track.artist.name}
                                    imageUrl={genreData.imageUrl[index]}
                                    duration={formatDurationForMilliseconds(track.duration)}
                                    isLoading={genreData.isLoading}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}



            <button onClick={handlePopOut} className="btn-mini">
                Вытащить плеер
            </button>

            {activeVideoId && (
                <div className="hidden pointer-events-none opacity-100">
                    <iframe
                        src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
                        allow="autoplay"
                    ></iframe>
                </div>
            )}
        </div>
    );
};
// НАДО БУДЕТ ДОБАВИТЬ КЕШИРОВАНИЕ НА УСЛОВНЫЙ ЧАС ЧТОБЫ НЕ ГРУЗИТЬ ПОСТОЯННО API ПРИ ПОВТОРНЫХ ЗАПРОСАХ ОДНИХ И ТЕХ ЖЕ ТРЕКОВ
// В CATEGORY 
export default MusicList;