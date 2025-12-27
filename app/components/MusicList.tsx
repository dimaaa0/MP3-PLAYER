import { Star, Settings } from 'lucide-react';

const MusicList = () => {
    return (
        <div className="card font-fr rounded-lg flex justify-between w-full p-3.5 bg-[#7776763b] text-white">

            <div className="title flex gap-6">
                <div className="bg-black w-16 h-full"></div>
                <div className="name flex flex-col justify-center">
                    <h1>Midnight Dreams</h1>
                    <h3>Aurora Waves</h3>
                </div>
            </div>


            <div className="details flex items-center justify-center gap-2">
                <h3>4:30</h3>
                <Star className='w-4.5 h-4.5 cursor-pointer' />
                <Settings className='w-4.5 h-4.5 cursor-pointer' />

            </div>


        </div>
    )
}

export default MusicList
