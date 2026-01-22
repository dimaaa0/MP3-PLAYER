export interface CategoryType {
    id: number;
    label: string;
    active: boolean;
}


export interface Track {
    name: string;
    artist: {
        name: string;
    };
    duration: string;
    image?: { size: string, '#text': string }[];
    url: string;
    mbid?: string;
}

export interface favoritesType {
    name: string;
    artist: {
        name: string;
    };
    imageUrl: string;
    duration: string;
    genre: string;
}

export interface TopTracksResponseType {
    tracks: {
        track: Track[];
        error?: string;
        message?: string;
    }
}

export interface UseTrackToReturn {
    duration: string[];
    imageUrl: string[];
    genre: string[];
    isLoading: boolean;
}

export interface MusicListProps {
    music: Track[];
    inputValue: boolean;
    recentCategory: string;
}

export interface StationData {
    stations: UseTrackToReturn[];
}

export interface HeaderProps {
    onMusicUpdate: (tracks: Track[]) => void;
    setInputValue: (value: boolean) => void;
    deleteSearch: (value: string) => void;
}

interface PlayingTrack {
    name: string;
    artist: string;
    imageUrl?: string;
}
