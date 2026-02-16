'use client'

import { useState } from "react";
import { CategoryType, HeaderProps } from '../types/types'



export default function Home({ setRecentCategory, setDeleteSearch }: HeaderProps) {

    const [categories, setCategories] = useState<CategoryType[]>([
        { id: 1, label: 'Favorites', active: false },
        { id: 2, label: 'My playlists', active: false },
        { id: 3, label: 'All', active: true },
        { id: 4, label: 'Rock', active: false },
        { id: 5, label: 'Pop', active: false },
        { id: 6, label: 'Jazz', active: false },
        { id: 7, label: 'Dance', active: false },
        { id: 8, label: 'Hip-Hop', active: false },
        { id: 9, label: 'Electronic', active: false },
        { id: 10, label: 'Indie', active: false },
    ]);



    const handleClick = (id: number) => {
        setDeleteSearch(Date.now()); //^ СБРОС ПОИСКА ПРИ ВЫБОРЕ КАТЕГОРИИ
        setCategories((prev) =>
            prev.map((cat) =>
                cat.id === id ? { ...cat, active: true } : { ...cat, active: false }
            )
        );
    };

    const selectCategory = (label: string) => {
        setRecentCategory?.(label); //^ ПРОВЕРКА СУЩЕСТВОВАНИЯ setRecentCategory ПЕРЕД ВЫЗОВОМ
    };

    return (
        <div className="flex font-fr justify-start gap-2 py-4 text-white overflow-x-auto " >
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => {
                        handleClick(cat.id);
                        selectCategory(cat.label);
                    }}
                    className={`px-8 py-2.5  text-nowrap rounded-lg cursor-pointer transition-colors ${cat.active
                        ? "bg-[#45474b]"
                        : "bg-[#3c414b80]  hover:bg-[#5a93b6b9]"
                        }`}
                >
                    {cat.label}
                </button>
            ))}
        </div>
    );
}
