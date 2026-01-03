export interface CategoryType {
    id: number;
    label: string;
    active: boolean;
}


export interface Track {
    id: string;
    name: string;
    artist: string;
    image: string;
    url: string;
}

export interface trackType {
    name: string;
    artist: string;
}

export interface favoritesType {
    name: string;
    artist: string;
    duration: { [key: number]: string };
    imageUrl: { [key: number]: string };
    genre: { [key: number]: string };
    isLoading: boolean;
}
