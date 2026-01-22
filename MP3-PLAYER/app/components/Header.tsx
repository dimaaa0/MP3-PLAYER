"use client";

import { useState, useEffect } from "react";
import Image from "next/image"
import { Search, X } from "lucide-react"
import Link from "next/link"
import { useUser, useStackApp, UserButton } from "@stackframe/stack";
import { Track, trackType, HeaderProps } from '../types/types'




const Header = ({ onMusicUpdate, setInputValue, deleteSearch }: HeaderProps) => {

    const user = useUser();
    const app = useStackApp();

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);




    const [listVisibility, setListVisibility] = useState(false);

    useEffect(() => {
        setInputValue(searchTerm.length < 2);
        if (searchTerm.length < 2) {
            setSearchResults([]);
            onMusicUpdate([]);
        }
    }, [searchTerm, setInputValue, onMusicUpdate]);

    useEffect(() => {
        if (deleteSearch !== 0) {
            setSearchTerm('');
        }
    }, [deleteSearch]);

    useEffect(() => { //^ САМ ПРОПС РОДИТЕЛЮ И СИСТЕМА ПОИСКА
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length >= 2) {
                try {
                    const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
                    const data = await res.json();
                    const tracks = data.results?.trackmatches?.track || [];

                    setSearchResults(tracks);
                    onMusicUpdate(tracks);

                } catch (err) {
                    console.error(err);
                }
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);

    }, [searchTerm, onMusicUpdate]);

    const [visibility, setVisibility] = useState(false);

    const handleChangeToVisibility = () => {
        setVisibility(true);
    };

    const handleChangeToInvisibility = () => {
        setVisibility(false);
    };

    const handleClearing = () => {
        setSearchTerm("");
    };

    const handleReload = () => {
        window.location.reload();
    };

    return (
        <div className="flex flex-col items-start mt-6">
            <div className="registration flex items-end fixed right-5 bottom-1 justify-end gap-3 mb-3">
                {!user ? (
                    <>
                        <button className="btn"><Link href='/sign-in'>Log in</Link></button>
                        <button className="btn"><Link href='/sign-up'>Sign up</Link></button>
                    </>
                ) : (
                    <div className="flex h-full items-center">
                        <span className="text-white h-full text-sm"><UserButton /></span>
                        <button
                            className="btn cursor-pointer text-white font-fr px-3 py-1 rounded"
                            onClick={() => app.signOut()}
                        >
                            Log out
                        </button>
                    </div>
                )}
            </div>
            <div className="flex content-between cursor-pointer justify-between w-full relative">
                <div onClick={handleReload} className="title flex items-center content-center gap-1.5">
                    <Image src="music.svg" alt="" width={38} height={38}
                        className="p-1.5 rounded-lg bg-[#3b33339a]"
                    />
                    <h1 className="font-fb text-2xl text-white">Music Stream</h1>
                </div>

                <div

                    className="searcher relative  text-white font-fr w-full max-w-65">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <Search className="absolute cursor-pointer left-2.5" size={14} />
                    </div>
                    <input
                        onMouseEnter={handleChangeToVisibility}
                        onMouseLeave={handleChangeToInvisibility}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}

                        type="text"
                        placeholder="Search tracks..."
                        className="w-full z-999 bg-[#0000003b] font-fr text-[14px] text-white text-sm rounded-xl border py-3 pl-10 pr-12 outline-none transition-colors placeholder:text-white"
                    />
                    <button
                        onMouseEnter={handleChangeToVisibility}
                        onMouseLeave={handleChangeToInvisibility}
                        onClick={handleClearing}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <X className={`w-5 h-5 cursor-pointer ${visibility ? 'opacity-100' : 'opacity-0'}`} />
                    </button>
                    <div>
                        {searchResults.length > 0 && searchTerm !== '' && (
                            <div className="relative">
                                <div className="z-[999] absolute top-full left-0 w-full bg-[#1a1a1a] border border-gray-700 rounded-xl mt-2 shadow-2xl overflow-hidden">
                                    <div className={`transition-all duration-500 ease-in-out ${listVisibility ? 'max-h-0 opacity-0' : 'max-h-80 opacity-100'}`}>
                                        <div className="max-h-60 overflow-y-auto hide-scrollbar">
                                            {searchResults.map((track: trackType, index) => (
                                                <div key={index} className="px-4 py-2 hover:bg-white/10 cursor-pointer flex flex-col border-b border-white/5 last:border-none">
                                                    <span className="text-sm font-bold">{track.name}</span>
                                                    <span className="text-xs text-gray-400">{track.artist}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setListVisibility(!listVisibility)}
                                        className="cursor-pointer relative w-full py-2 bg-[#222] border-t border-gray-700 hover:bg-[#2a2a2a] text-xs text-gray-400 transition-colors"
                                    >
                                        {listVisibility ? 'Show list' : 'Hide the list'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;