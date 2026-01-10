import { Calendar, MapPin } from 'lucide-react';
import { useMatch } from '../hooks/useMatch';
import { format } from 'date-fns';

const LOGO_MAP: Record<string, string> = {
    'Fulham': '/fulham-logo.png',
    'Liverpool': '/lfc-fan-logo.png',
};

export const MatchBanner = () => {
    const { match, loading, error } = useMatch();

    if (loading) {
        return (
            <div className="w-full bg-white border border-gray-100 rounded-lg p-3 md:p-4 mb-6 flex items-center justify-between shadow-sm animate-pulse h-[88px]">
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
                <div className="flex flex-col items-center gap-2">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                </div>
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
        );
    }

    if (error || !match) {
        // Fallback or hide? For now, we can hide or show a generic "Matchday" message.
        // Let's show a fallback static banner or return null.
        // Given the requirement, improved resilience is better. Let's return null to avoid broken UI.
        return null;
    }

    const opponentLogo = LOGO_MAP[match.opponent] || '/premier-league-logo.png'; // You might need a generic fallback

    // Determine Home/Away visual order
    const homeTeam = match.isHome ? 'Liverpool' : match.opponent;
    const awayTeam = match.isHome ? match.opponent : 'Liverpool';
    const homeLogo = match.isHome ? '/lfc-fan-logo.png' : opponentLogo;
    const awayLogo = match.isHome ? opponentLogo : '/lfc-fan-logo.png';

    // Format Date: "Sun 4 Jan"
    const dateStr = format(match.date, 'EEE d MMM');
    // Format Time: "10:00 AM" (Local to user)
    const timeStr = format(match.date, 'h:mm a');
    // Location simplified
    const location = match.location.split(',')[0];

    return (
        <div className="w-full bg-white border border-gray-100 rounded-lg p-3 md:p-4 mb-6 flex items-center justify-between shadow-sm">
            {/* Home Team */}
            <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end">
                <span className="hidden md:block font-bold text-gray-900 text-lg text-right leading-tight">{homeTeam}</span>
                <div className="h-10 w-10 md:h-12 md:w-12 relative flex-shrink-0">
                    <img
                        src={homeLogo}
                        alt={homeTeam}
                        className="h-full w-full object-contain"
                        onError={(e) => {
                            // Fallback to text identifier or generic shield if image fails
                            (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg';
                        }}
                    />
                </div>
            </div>

            {/* Match Info */}
            <div className="flex flex-col items-center justify-center px-3 md:px-6 mx-2 md:mx-4 border-x border-gray-100 min-w-[120px] md:min-w-[160px]">
                <div className="flex items-center text-lfc-red font-bold text-[10px] md:text-sm mb-1 uppercase tracking-wider">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{dateStr}</span>
                </div>
                <div className="text-lg md:text-2xl font-bold text-gray-900 leading-none mb-1 text-center">
                    {timeStr}
                </div>
                <div className="flex items-center text-gray-400 text-[10px] md:text-xs font-medium text-center line-clamp-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{location}</span>
                </div>
            </div>

            {/* Away Team */}
            <div className="flex items-center gap-2 md:gap-3 flex-1 justify-start">
                <div className="h-10 w-10 md:h-12 md:w-12 relative flex-shrink-0">
                    <img
                        src={awayLogo}
                        alt={awayTeam}
                        className="h-full w-full object-contain"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg';
                        }}
                    />
                </div>
                <span className="hidden md:block font-bold text-gray-900 text-lg leading-tight">{awayTeam}</span>
            </div>
        </div>
    );
};
