'use client'

import Header from './components/Header'
import Category from './components/Category'
import MusicList from './components/MusicList'
import { useState } from 'react';
import { Track } from './types/types'

export default function Home() {

  const [currentTracks, setCurrentTracks] = useState<Track[]>([]);
  const [inputValue, setInputValue] = useState(false);
  const [recentCategory, setRecentCategory] = useState('All');
  const [deleteSearch, setDeleteSearch] = useState(0);

  return (
    <div className='container'>
      <Header
        onMusicUpdate={setCurrentTracks}
        setInputValue={setInputValue}
        deleteSearch={deleteSearch}
      />
      <Category
        setDeleteSearch={setDeleteSearch}
        setRecentCategory={setRecentCategory} />
      <MusicList
        music={currentTracks}
        inputValue={inputValue}
        recentCategory={recentCategory} />
    </div>
  );
}