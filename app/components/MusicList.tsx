
const MusicList = () => {
    return (
        <div className="card flex justify-between w-full p-4 bg-amber-200">

            <div className="title flex gap-6">
                <div className="bg-black w-16 h-full"></div>
                <div className="name flex flex-col justify-center">
                    <h1>Midnight Dreams</h1>
                    <h3>Aurora Waves</h3>
                </div>
            </div>


            <div className="details flex flex-col items-start">
                <h3>4:30</h3>
                <button>Add to favorites</button>
                <button>settings</button>
            </div>


        </div>
    )
}

export default MusicList
