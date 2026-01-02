import { Calendar, MapPin } from 'lucide-react';

export const MatchBanner = () => {
    return (
        <div className="w-full bg-white border border-gray-100 rounded-lg p-3 md:p-4 mb-6 flex items-center justify-between shadow-sm">
            {/* Home Team (Liverpool) */}
            <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end">
                <span className="hidden md:block font-bold text-gray-900 text-lg">Liverpool</span>
                <div className="h-10 w-10 md:h-12 md:w-12 relative">
                    <img
                        src="/lfc-fan-logo.png"
                        alt="Liverpool FC"
                        className="h-full w-full object-contain"
                    />
                </div>
            </div>

            {/* Match Info */}
            <div className="flex flex-col items-center justify-center px-3 md:px-6 mx-2 md:mx-4 border-x border-gray-100 min-w-[110px] md:min-w-[140px]">
                <div className="flex items-center text-lfc-red font-bold text-[10px] md:text-sm mb-1 uppercase tracking-wider">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Sun 4 Jan</span>
                </div>
                <div className="text-lg md:text-2xl font-bold text-gray-900 leading-none mb-1">
                    10:00 AM ET
                </div>
                <div className="flex items-center text-gray-400 text-[10px] md:text-xs font-medium">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>Anfield</span>
                </div>
            </div>

            {/* Away Team (Fulham) */}
            <div className="flex items-center gap-2 md:gap-3 flex-1 justify-start">
                <div className="h-10 w-10 md:h-12 md:w-12 relative">
                    <img
                        src="/fulham-logo.png"
                        alt="Fulham FC"
                        className="h-full w-full object-contain"
                    />
                </div>
                <span className="hidden md:block font-bold text-gray-900 text-lg">Fulham</span>
            </div>
        </div>
    );
};
