'use client';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Play, Heart, Share2 } from 'lucide-react';

const Page = () => {
    const params = useParams();
    const searchParams = useSearchParams();

    const id = params.id;
    const name = searchParams.get('name');
    const count = searchParams.get('count');
    const imageUrl = searchParams.get('imageUrl');

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
            <div className="relative h-60  bg-gradient-to-r from-purple-900 to-blue-900">
                <div className="absolute inset-0 opacity-30">
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt={name || 'Playlist'}
                            className="w-full h-full object-cover blur-xl"
                        />
                    )}
                </div>
                <div className="relative h-full flex items-end">
                    <div className="container mx-auto px-6 pb-8 flex gap-8 items-end">
                        {imageUrl && (
                            <div className="shrink-0">
                                <img
                                    src={imageUrl}
                                    alt={name || 'Playlist'}
                                    className="w-56 h-56 rounded-xl shadow-2xl object-cover border-4 border-white/10"
                                />
                            </div>
                        )}

                            <h2 className='absolute top-8 left-8 '>Главная</h2>
                        <div className="pb-2">
                            <p className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Playlist</p>
                            <h1 className="text-6xl font-black text-white mt-2 line-clamp-3">
                                {name || 'Playlist Data'}
                            </h1>
                            <div className="flex items-center gap-4 mt-4 mb-4">
                                <span className="text-gray-200">
                                    <span className="font-bold text-white">{count}</span> tracks
                                </span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-200">ID: <span className="font-mono text-gray-300">{id}</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="flex gap-4 mb-16 mt-6">
                    <button className="px-8 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-full flex items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:scale-105">
                        <Play className="w-5 h-5 fill-current" />
                        Listen
                    </button>
                    <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full flex items-center gap-2 transition-all border border-white/20">
                        <Heart className="w-5 h-5" />
                        Like
                    </button>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Tracks in the playlist</h2>

                    <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-white/5 rounded-t-lg border-b border-white/10 text-sm font-semibold text-gray-300 mb-2">
                        <div className="col-span-1">#</div>
                        <div className="col-span-5">Name</div>
                        <div className="col-span-3">Singer</div>
                        <div className="col-span-2">Duration</div>
                        <div className="col-span-1">•</div>
                    </div>

                    <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-lg border border-white/10 px-8 py-16 text-center">
                        <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                            </svg>
                        </div>
                        <p className="text-gray-400 text-lg">Начните добавлять треки в плейлист</p>
                        <p className="text-gray-500 text-sm mt-2">Треки будут отображаться здесь</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;