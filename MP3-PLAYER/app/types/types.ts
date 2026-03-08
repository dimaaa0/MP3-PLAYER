export interface CategoryType {
    id: number;
    label: string;
    active: boolean;
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
export interface favoritesType {
    name: string;
    artist: {
        name: string;
    };
    imageUrl: string;
    duration: string;
    genre: string;
    goingTime: number;
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

export interface Track {
    name: string;
    artist: {
        name: string;
    };
    duration: string;
    image?: { size: string, '#text': string }[];
    url: string;
    mbid?: string;
    goingTime?: number;
}

export interface PlayingTrack {
    name: string;
    artist: string;
    duration: string;
    imageUrl?: string;
    goingTime: number;
}

export interface Playlist {
    id?: string | number;
    name: string;
    tracks: Track[];
    imageUrl?: string;
}

export interface PlaylistCollection {
    playlists: Playlist[];
}