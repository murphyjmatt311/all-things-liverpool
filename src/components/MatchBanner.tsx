import { Calendar, MapPin } from 'lucide-react';

export const MatchBanner = () => {
    return (
        <div className="w-full bg-white border border-gray-100 rounded-lg p-4 mb-6 flex items-center justify-between shadow-sm">
            {/* Home Team (Liverpool) */}
            <div className="flex items-center gap-3 flex-1 justify-end">
                <span className="hidden md:block font-bold text-gray-900 text-lg">Liverpool</span>
                <div className="h-12 w-12 relative">
                    <img
                        src="/lfc-fan-logo.png"
                        alt="Liverpool FC"
                        className="h-full w-full object-contain"
                    />
                </div>
            </div>

            {/* Match Info */}
            <div className="flex flex-col items-center justify-center px-6 mx-4 border-x border-gray-100 min-w-[140px]">
                <div className="flex items-center text-lfc-red font-bold text-sm mb-1 uppercase tracking-wider">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Sun 14 Jan</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 leading-none mb-1">
                    16:30
                </div>
                <div className="flex items-center text-gray-400 text-xs font-medium">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>Anfield</span>
                </div>
            </div>

            {/* Away Team (Fulham) */}
            <div className="flex items-center gap-3 flex-1 justify-start">
                <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs border-2 border-gray-100">
                    FUL
                </div>
                <span className="hidden md:block font-bold text-gray-900 text-lg">Fulham</span>
            </div>
        </div>
    );
};
