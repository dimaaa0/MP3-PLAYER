"use client";

import { Star, Settings, Play, Pause, Loader2, Trash2, AlignVerticalJustifyStartIcon } from 'lucide-react'; // Добавил иконки
import { Track, favoritesType, MusicListProps, Playlist, PlaylistCollection } from '../types/types';
import { useState, useEffect, useCallback } from 'react';
import { useTrackInfo } from '../hooks/useTrackInfo';
import { useTopTracks } from '../hooks/useTopTracks';
import { useSelectByGenre } from '../hooks/useSelectByGenre';
import { useYoutubePlayer } from '../hooks/useYoutubePlayer';
import { current } from '@reduxjs/toolkit';

const MusicList = ({ music, inputValue, recentCategory }: MusicListProps) => {
    const [favorites, setFavorites] = useState<favoritesType[]>([]);
    const { activeVideoId, currentTrack, isLoadingVideo, playTrack, stopPlayback, updateGoingTime } = useYoutubePlayer(); // МУЗЫКАК КОТОРАЯ ИГРАЕТ СЕЙЧАС
    const { tracks, loading } = useTopTracks();
    const selectByGenre = useSelectByGenre(recentCategory || 'All');
    const trendData = useTrackInfo(tracks?.tracks?.track || []);
    const searchData = useTrackInfo(music || []);
    const genreData = useTrackInfo(selectByGenre.data?.tracks || []);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    let id = 0 // Setted id

    const formatDuration = (duration: string | number): string => {
        const num = typeof duration === 'string' ? parseInt(duration) : duration;
        if (num == 0) return '0:00';

        else if (!num || isNaN(num))
            return '--:--';

        const seconds = num > 10000 ? Math.floor(num / 1000) : num;

        const minutes = Math.floor(seconds / 60);
        const secs = (seconds) % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const formatGoingTime = (goingTime: number) => {
        if (goingTime > 10000) {
            goingTime = Math.floor(goingTime / 1000);
        } return goingTime;
    }

    const FormatDurationPlusExtraSeconds = (duration: string | number): string => { //~ IN ORDER TO FIX PROGRESS BAR GOING A BIT FASTER THAN ACTUAL DURATION
        const num = typeof duration === 'string' ? parseInt(duration) : duration;
        if (num == 0) return '0:00';

        else if (!num || isNaN(num))
            return '--:--';

        const seconds = num > 10000 ? Math.floor(num / 1000) : num;

        const minutes = Math.floor(seconds / 60);
        const secs = (seconds + 2) % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const handleFavorite = (trackName: string, artistName: string, imageUrl: string, duration: string) => {
        setFavorites((prev) => {
            const isExist = prev.some(item => item.name === trackName && item.artist === artistName);
            let newFavorites;
            if (isExist) {
                newFavorites = prev.filter(item => !(item.name === trackName && item.artist === artistName));
            } else {
                newFavorites = [...prev, { name: trackName, artist: artistName, imageUrl, duration }];
            }
            return newFavorites;
        });
    };

    useEffect(() => {
        const channel = new BroadcastChannel('music_player_channel');
        channel.postMessage({
            type: 'FAVORITES_UPDATE',
            favorites: favorites
        });
        return () => channel.close();
    }, [favorites]);

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
                    duration: currentTrack.duration,
                    ...(currentTrack.imageUrl && { imageUrl: currentTrack.imageUrl }),
                    goingTime: currentTrack.goingTime,
                    isLoadingVideo: isLoadingVideo,
                    isPlaying: !!activeVideoId,
                    activeVideoId: activeVideoId || null,
                    updateGoingTime: currentTrack.goingTime,
                }
            });
        }
    }, [currentTrack, isLoadingVideo, activeVideoId]);

    // helper to broadcast stop from anywhere in this component
    const broadcastStop = useCallback(() => {
        const ch = new BroadcastChannel('music_player_channel');
        ch.postMessage({ type: 'STOP_TRACK', track: currentTrack ? { name: currentTrack.name, artist: currentTrack.artist } : null });
        ch.close();
    }, [currentTrack]);

    useEffect(() => {
        const channel = new BroadcastChannel('music_player_channel');

        // send initial state when component mounts
        broadcastTrackUpdate(channel);

        if (!currentTrack) {
            // notify listeners that playback has stopped
            channel.postMessage({ type: 'STOP_TRACK' });
        }

        channel.onmessage = (event) => {
            if (event.data.type === 'REQUEST_CURRENT_TRACK') {
                broadcastTrackUpdate(channel);
            } else if (event.data.type === 'STOP_TRACK') {
                stopPlayback();
            } else if (event.data.type === 'PLAY_TRACK') {
                const t = event.data.track;
                if (t?.name && t?.artist) {
                    playTrack(t.name, t.artist, t.imageUrl);
                } else {
                    broadcastTrackUpdate(channel);
                }
            }
        };

        return () => channel.close();
    }, [currentTrack, isLoadingVideo, broadcastTrackUpdate, broadcastStop]);

    const handlePopOut = () => {
        const width = 400;
        const height = 540;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const features = [
            `width=${width}`, `height=${height}`, `left=${left}`, `top=${top}`,
            'popup=yes', 'resizable=no', 'scrollbars=no'
        ].join(',');

        window.open('/pages/mini-player', 'MusicStreamPlayer', features);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (activeVideoId && currentTrack) {
            interval = window.setInterval(() => {
                const durationNormalized = formatGoingTime(currentTrack.duration);
                const going = typeof currentTrack.goingTime === 'string' ? parseInt(currentTrack.goingTime) : currentTrack.goingTime;

                if (currentTrack?.duration && !isNaN(Number(durationNormalized)) && !isNaN(Number(going)) && going >= durationNormalized) {
                    stopPlayback();
                } else {
                    updateGoingTime(1);
                }
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [activeVideoId, updateGoingTime, currentTrack?.goingTime, currentTrack?.duration, currentTrack?.name]);

    const addToPlaylist = (playlistId: number, name: string) => {
        console.log(`Adding track ${name} to playlist with ID ${playlistId}`);
    }

    const TrackRow = (
        {
            name,
            artist,
            imageUrl,
            duration,
            isLoading,
            id,
            goingTime = '0:00'
        }: { name: string, artist: string, imageUrl: string, duration: string, isLoading?: boolean, id: number, goingTime?: string }) => {
        const active = isFavorite(name, artist);

        const isCurrentActive = currentTrack?.name === name && currentTrack?.artist === artist;

        return (
            <div
                onClick={() => {
                    handlePopOut();
                }}
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
                                            onClick={(e) => { e.stopPropagation(); stopPlayback(); broadcastStop(); }} />
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
                                            onClick={(e) => { e.stopPropagation(); stopPlayback(); broadcastStop(); }} />
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
                        <span className="text-xs text-gray-500">{id}</span>
                    </div>
                </div>
                <div className="details flex items-center gap-2">
                    <h3 className="text-sm tabular-nums mr-2">{duration}</h3>
                    <h3 className="text-sm tabular-nums mr-2">{isCurrentActive ? currentTrack?.goingTime ? formatDuration(currentTrack.goingTime) : goingTime : goingTime}</h3>
                    <Star
                        onClick={(e) => {
                            e.stopPropagation();
                            handleFavorite(name, artist, imageUrl, duration);
                        }}
                        className={`w-5 h-5 transition-all ${active ? 'text-yellow-400 fill-yellow-400 scale-110' : 'text-gray-400'}`}
                    />
                    <Settings
                        onClick={() => {
                            addToPlaylist(id, name);
                        }}
                        className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
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
                    duration: currentTrack.duration,
                    ...(currentTrack.imageUrl && { imageUrl: currentTrack.imageUrl }),
                    goingTime: currentTrack.goingTime,
                    isLoadingVideo: isLoadingVideo,
                    isPlaying: !!activeVideoId,
                    activeVideoId: activeVideoId || null,
                    updateGoingTime: currentTrack.goingTime,
                }
            });
        }

        channel.onmessage = (event) => {
            if (event.data.type === 'ADD_FAVORITE') {
                const { track } = event.data;
                handleFavorite(track.name, track.artist, track.imageUrl, track.duration);
            }
        };

        return () => channel.close();
    }, [currentTrack, isLoadingVideo, activeVideoId]);

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
                                id={id++}
                                goingTime="0:00"
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
                            id={id++}
                            goingTime="0:00"
                        />
                    ))}
                </div>
            ) : (
                <div className="All">
                    {(loading || trendData.isLoading && recentCategory !== 'My playlists' && recentCategory !== 'Favorites') ? (
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
                                    id={id++}
                                    goingTime="0:00"
                                />
                            ))}
                        </div>

                    ) :

                        recentCategory !== 'All' && recentCategory !== 'My playlists' && (

                            <div className="flex flex-col gap-2">
                                {selectByGenre.data?.tracks.map((track: Track, index: number) => (
                                    <TrackRow
                                        key={index}
                                        name={track.name}
                                        artist={typeof track.artist === 'string' ? track.artist : track.artist.name}
                                        imageUrl={genreData.imageUrl[index]}
                                        duration={formatDuration(track.duration)}
                                        isLoading={genreData.isLoading}
                                        id={id++}
                                        goingTime="0:00"
                                    />
                                ))}
                            </div>
                        )}

                    {recentCategory == 'My playlists' && (

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {playlists.length > 0 && (
                                playlists.map((playlist, index) => (
                                    <div key={index} className="bg-[#1e1e1e] hover:bg-[#2a2a2a] transition-colors rounded-xl p-4 flex items-center gap-4 group cursor-default">
                                        <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                                            <img
                                                src={playlist.imageUrl || "/default-cover.jpg"}
                                                alt={playlist.name}
                                                className="w-full h-full border p-2 rounded-lg border-gray-700  object-cover"
                                            />
                                        </div>

                                        <div className="flex flex-col  justify-between flex-grow h-full py-1">
                                            <div>
                                                <h2 className="text-white font-bold text-lg line-clamp-1">{playlist.name}</h2>
                                                <p className="text-gray-400 text-sm">{playlist.tracks ? playlist.tracks.length : 0} tracks</p>
                                            </div>

                                            <div className="flex items-center gap-3 mt-2">
                                                <button className="p-2 cursor-pointer bg-white/10 hover:bg-white/20 rounded-full transition-all">
                                                    <Play className="w-4 h-4 text-white fill-white" />
                                                </button>
                                                <div className="flex gap-2 ml-auto">
                                                    <button className="p-1.5 cursor-pointer text-gray-500 hover:text-white transition-colors">
                                                        <Settings className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-1.5 cursor-pointer text-gray-500 hover:text-red-500 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )
                            }
                            <div className='ADD-PLAYLIST-BUTTON'>
                                <button onClick={() => {
                                    const newPlaylist: Playlist = {
                                        id: Date.now(),
                                        name: `New Playlist ${playlists.length + 1}`,
                                        tracks: [],
                                        imageUrl: "/default-cover.jpg"
                                    };
                                    setPlaylists((prev) => [...prev, newPlaylist]);
                                }} className="w-full h-32 cursor-pointer border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center text-gray-500 hover:border-gray-300 transition-colors">
                                    <h1 className="text-sm font-medium">+ Add Playlist</h1>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )
            }



            {
                activeVideoId && (
                    <div className="hidden pointer-events-none opacity-100">
                        <iframe
                            src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
                            allow="autoplay"
                        ></iframe>
                    </div>
                )
            }
        </div >
    );
};
export default MusicList;

//& PROGRESS BAR
//^ ПРОИГРОВКА СЛЕДУЮЩЕГО ТРЕКА ПО ЗАВЕРШЕНИЮ ТЕКУЩЕГО (МОЖЕТ БЫТЬ СЛОЖНО ИЗ-ЗА YOUTUBE API)
//? РЕАЛИЗОВАТЬ ВОЗМОЖНОСТЬ ПЕРЕТАСКИВАНИЯ ТРЕКОВ ДЛЯ ИЗМЕНЕНИЯ ИХ ПОРЯДКА В СПИСКЕ
//* КНОПКА СЛЕДУЮЩИЙ И ПРЕДЫДУЩИЙ ТРЕК

//~ ДОБАВЛЕНИЕ PLAYLIST BUTTON 

