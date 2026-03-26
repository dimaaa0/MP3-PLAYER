'use client';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Play, Heart, Share2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './page.css';

const Page = () => {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const id = params.id;
    const name = searchParams.get('name');
    const count = searchParams.get('count');
    const imageUrl = searchParams.get('imageUrl');
    const tracks: { name: string; artist: string; duration: string; imageUrl: string; }[] = searchParams.get('tracks') ? searchParams.get('tracks')!.split(',').map(t => {
        const [name, artist, duration, imageUrl] = t.split('-');
        return { name, artist, duration, imageUrl };
    }) : [];

    console.log(tracks);

    return (
            <div className="min-h-screen bg-linear-to-b from-gray-900 via-gray-800 to-black text-white">
                <div className="relative h-60 ">
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
                            <Link href="/" className="absolute top-4 left-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                <ChevronLeft className="text-white" />
                                <span className="sr-only">Back to main menu</span>
                            </Link>
                            <div className="pb-2">
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
                        <button className="px-8 py-3 bg-green-500 cursor-pointer hover:bg-green-400 text-black font-bold rounded-full flex items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:scale-105">
                            <Play className="w-5 h-5 fill-current" />
                            Listen
                        </button>
                        <button className="px-8 py-3 bg-white/10 hover:bg-white/20 cursor-pointer text-white font-bold rounded-full flex items-center gap-2 transition-all border border-white/20">
                            <Heart className="w-5 h-5" />
                            Like
                        </button>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">Tracks in the playlist</h2>
                        <div className="bg-linear-to-br from-white/5 to-white/10 rounded-lg border border-white/10 px-8 py-16 text-center">
                            {
                                tracks.length > 0 ? (
                                    <ul className="space-y-4">
                                        {tracks.map((track, index) => (
                                            <li key={index} className="text-left">
                                                <span className="font-bold">{track.name}</span> - <span className="text-gray-400">{track.artist}</span> - <span className="text-gray-400">{track.duration}</span> -  <span className="text-gray-400">{track.imageUrl}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-white/10 rounded-full mx-auto cursor-pointer mb-4 flex items-center justify-center">
                                            <Link href={`/`} className="w-full h-full flex items-center justify-center">
                                                <svg className="w-8 h-8 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                                                </svg>
                                            </Link>
                                        </div>
                                        <p className="text-gray-400 text-lg">Начните добавлять треки в плейлист</p>
                                        <p className="text-gray-500 text-sm mt-2">Треки будут отображаться здесь</p>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default Page;