'use client'

import { useState } from "react";
import { CategoryType } from '../types/types'

export default function Home({ }) {
    const [categories, setCategories] = useState<CategoryType[]>([
        { id: 1, label: 'Favorites', active: false },
        { id: 2, label: 'All', active: true },
        { id: 3, label: 'Rock', active: false },
        { id: 4, label: 'Pop', active: false },
        { id: 5, label: 'Alternative', active: false },
        { id: 6, label: 'Indie', active: false },
        { id: 7, label: 'Electronic', active: false },
        { id: 8, label: 'Love', active: false },
        { id: 9, label: 'Dance', active: false }
    ]);

    const handleClick = (id: number) => {
        setCategories((prev) =>
            prev.map((cat) =>
                cat.id === id ? { ...cat, active: true } : { ...cat, active: false }
            )
        );
    };

    return (
        <div className="flex font-fr justify-start gap-2 py-4 text-white" >
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => handleClick(cat.id)}
                    className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${cat.active
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
