import Header from './components/Header'
import Category from './components/Category'
import MusicList from './components/MusicList'

export default function Home() {
  return (
    <div className='container'>
      <Header />
      <Category />
      <MusicList />
    </div>
  );
}
