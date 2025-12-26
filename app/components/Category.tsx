'use client'

import { useState } from "react";

interface CategoryType {
    id: number;
    label: string;
    active: boolean;
}

export default function Home({ }) {
    const [categories, setCategories] = useState<CategoryType[]>([
        { id: 1, label: 'Favorites', active: false },
        { id: 2, label: 'All', active: true },
        { id: 3, label: 'Jazz', active: false },
        { id: 4, label: 'Pop', active: false },
        { id: 5, label: 'Rock', active: false },
        { id: 6, label: 'Hip-hop', active: false },
        { id: 7, label: 'Electronic', active: false }
    ]);

    const handleClick = (id: number) => {
        setCategories((prev) =>
            prev.map((cat) =>
                cat.id === id ? { ...cat, active: true } : { ...cat, active: false }
            )
        );
    };

    return (
        <div className="flex justify-start gap-2 p-4" >
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => handleClick(cat.id)}
                    className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${cat.active
                        ? "bg-blue-600 text-white"
                        : "bg-[#121926be] text-gray-300 hover:bg-[#1c2638]"
                        }`}
                >
                    {cat.label}
                </button>
            ))}
        </div>
    );
}
