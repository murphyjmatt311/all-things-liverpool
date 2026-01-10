import { useState, useEffect } from 'react';

interface MatchData {
    opponent: string;
    date: Date;
    location: string;
    isHome: boolean;
    competition?: string;
}

const LCS_ICS_URL = 'https://calendar.google.com/calendar/ical/p520al5mfgqq5m2a8pu021nv0c%40group.calendar.google.com/public/basic.ics';
// Use allorigins to bypass CORS
const PROXY_URL = 'https://api.allorigins.win/raw?url=';

export const useMatch = () => {
    const [match, setMatch] = useState<MatchData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                // Add timestamp to bypass caching
                const response = await fetch(`${PROXY_URL}${encodeURIComponent(LCS_ICS_URL)}&t=${Date.now()}`);
                if (!response.ok) throw new Error('Failed to fetch calendar');

                const text = await response.text();
                const now = new Date();

                // Simple ICS parsing
                const events: MatchData[] = [];
                const lines = text.split(/\r\n|\n|\r/);

                let currentEvent: Partial<MatchData> | null = null;
                let inEvent = false;

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];

                    if (line.startsWith('BEGIN:VEVENT')) {
                        inEvent = true;
                        currentEvent = {};
                        continue;
                    }

                    if (line.startsWith('END:VEVENT')) {
                        inEvent = false;
                        if (currentEvent && currentEvent.date && currentEvent.opponent) {
                            // Verify it's a future event (or ongoing)
                            // Give it a 2-hour buffer for ongoing games
                            const matchEnd = new Date(currentEvent.date.getTime() + 2 * 60 * 60 * 1000);
                            if (matchEnd > now) {
                                events.push(currentEvent as MatchData);
                            }
                        }
                        currentEvent = null;
                        continue;
                    }

                    if (!inEvent || !currentEvent) continue;

                    if (line.startsWith('DTSTART')) {
                        // Handle format: DTSTART:20231021T113000Z or DTSTART;VALUE=DATE:20231021
                        const dateStr = line.split(':')[1];
                        if (dateStr) {
                            // Basic ISO conversion for ICS format (YYYYMMDDTHHmmssZ)
                            const year = parseInt(dateStr.substring(0, 4));
                            const month = parseInt(dateStr.substring(4, 6)) - 1;
                            const day = parseInt(dateStr.substring(6, 8));
                            let hour = 0;
                            let minute = 0;

                            if (dateStr.includes('T')) {
                                hour = parseInt(dateStr.substring(9, 11));
                                minute = parseInt(dateStr.substring(11, 13));
                            }

                            // Assume Z (UTC) for simplicity as most calendars use it
                            const date = new Date(Date.UTC(year, month, day, hour, minute));
                            currentEvent.date = date;
                        }
                    }

                    if (line.startsWith('SUMMARY:')) {
                        const summary = line.substring(8);
                        // Format is usually "Liverpool - Opponent" or "Opponent - Liverpool"
                        // Or "Liverpool v Opponent"
                        if (summary.includes('Liverpool')) {
                            const parts = summary.split(/\s+[-–v]\s+/);
                            // Identify home/away
                            if (parts[0].trim() === 'Liverpool') {
                                currentEvent.isHome = true;
                                currentEvent.opponent = parts[1]?.trim() || 'TBD';
                            } else {
                                currentEvent.isHome = false;
                                currentEvent.opponent = parts[0]?.trim() || 'TBD';
                            }
                        } else {
                            // Maybe just the opponent name if it's a specific LFC calendar?
                            // But usually it has both. fallback:
                            currentEvent.opponent = summary;
                            currentEvent.isHome = true; // Default
                        }
                    }

                    if (line.startsWith('LOCATION:')) {
                        // escape chars often in ICS like \,
                        currentEvent.location = line.substring(9).replace(/\\,/g, ',').trim();
                    }
                }

                // Sort by date
                events.sort((a, b) => a.date.getTime() - b.date.getTime());

                // Get next match
                if (events.length > 0) {
                    setMatch(events[0]);
                } else {
                    setError('No upcoming matches found');
                }

            } catch (err) {
                console.error('Error fetching match:', err);
                setError('Failed to load match data');
            } finally {
                setLoading(false);
            }
        };

        fetchMatch();
    }, []);

    return { match, loading, error };
};
