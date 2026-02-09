import { Volume, Volume2, VolumeX } from 'lucide-react';

interface VolumeControlProps {
    volume: number;
    onVolumeChange: (volume: number) => void;
}

export const VolumeControl = ({ volume, onVolumeChange }: VolumeControlProps) => {
    return (
        <div className="bg-[#7776763b] rounded-lg p-4 flex items-center gap-3 hover:bg-[#7776765d] transition-colors">
            <div className="flex items-center gap-2 flex-1">
                {volume === 0 ? (
                    <VolumeX className="w-5 h-5 text-red-400 flex-shrink-0" />
                ) : volume < 50 ? (
                    <Volume className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                    <Volume2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                )}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => onVolumeChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                    title="Громкость (Volume)"
                    style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume}%, #4b5563 ${volume}%, #4b5563 100%)`
                    }}
                />
                <span className="text-xs text-gray-400 w-10 text-right font-semibold">{volume}%</span>
            </div>
        </div>
    );
};
