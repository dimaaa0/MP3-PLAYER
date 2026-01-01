'use client'

import Header from './components/Header'
import Category from './components/Category'
import MusicList from './components/MusicList'
import { useState } from 'react';
import { Track } from './types/types'

export default function Home() {

  const [currentTracks, setCurrentTracks] = useState<Track[]>([]);

  return (
    <div className='container'>
      <Header onMusicUpdate={setCurrentTracks} />
      <Category />
      <MusicList music={currentTracks} />
    </div>
  );
}
