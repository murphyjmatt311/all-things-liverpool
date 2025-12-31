import { FALLBACK_IMAGE_URL } from '../constants';

export interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    contentSnippet?: string;
    content?: string;
    source: string;
    isoDate?: string;
    enclosure?: {
        url: string;
        type?: string;
    };
    tags: string[];
    type?: 'podcast' | 'news';
}

const SOURCES = [
    { name: 'Liverpool.com', url: 'https://www.liverpool.com/?service=rss' },
    { name: 'The Guardian', url: 'https://www.theguardian.com/football/liverpool/rss' },
    { name: 'Reddit', url: 'https://www.reddit.com/r/LiverpoolFC/hot.rss' },
    { name: 'Anfield Watch', url: 'https://www.anfieldwatch.co.uk/feed' },
    { name: 'BBC Sport', url: 'https://feeds.bbci.co.uk/sport/football/teams/liverpool/rss.xml' },
    { name: 'Liverpool Echo', url: 'https://www.liverpoolecho.co.uk/liverpool-fc/?service=rss' },
    { name: 'This Is Anfield', url: 'https://www.thisisanfield.com/feed/' },
    { name: 'Empire of the Kop', url: 'https://www.empireofthekop.com/feed/' },
    // Podcasts
    { name: 'Walk On', url: 'https://feeds.acast.com/public/shows/walk-on-the-athletic-fcs-liverpool-show', type: 'podcast' },
    { name: 'The Anfield Wrap', url: 'https://feeds.megaphone.fm/COMG6516013185', type: 'podcast' },
];

const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json?rss_url=';

// Keywords for auto-tagging
const TAG_KEYWORDS: Record<string, string[]> = {
    // Players
    'Arne Slot': ['slot', 'head coach', 'manager'],
    'Mohamed Salah': ['salah', 'mo salah', 'egyptian king'],
    'Virgil van Dijk': ['van dijk', 'virgil', 'vvd'],
    'Trent Alexander-Arnold': ['trent', 'alexander-arnold', 'taa'],
    'Darwin Nunez': ['nunez', 'darwin'],
    'Luis Diaz': ['diaz', 'lucho'],
    'Dominik Szoboszlai': ['szoboszlai', 'dom'],
    'Alexis Mac Allister': ['mac allister', 'macca'],
    'Alisson Becker': ['alisson', 'becker'],
    'Ryan Gravenberch': ['gravenberch'],
    'Ibrahima Konate': ['konate', 'ibou'],
    'Diogo Jota': ['jota', 'diogo'],
    'Cody Gakpo': ['gakpo', 'cody'],
    'Andy Robertson': ['robertson', 'robbo'],
    'Curtis Jones': ['curtis jones', 'curtis'],
    'Harvey Elliott': ['elliott', 'harvey'],
    'Caoimhin Kelleher': ['kelleher', 'caoimhin'],
    'Wataru Endo': ['endo', 'wataru'],
    'Jarell Quansah': ['quansah'],
    'Conor Bradley': ['bradley'],
    'Kostas Tsimikas': ['tsimikas', 'kostas'],
    'Joe Gomez': ['gomez', 'joe'],
    'Federico Chiesa': ['chiesa'],
    'Alexander Isak': ['isak', 'alexander isak'],

    // Topics
    'Transfers': ['transfer', 'signing', 'bid', 'target', 'rumour', 'gossip', 'deal'],
    'Premier League': ['premier league', 'pl', 'league table'],
    'Champions League': ['champions league', 'ucl', 'europe'],
    'Carabao Cup': ['carabao cup', 'league cup'],
    'FA Cup': ['fa cup'],
    'Academy': ['academy', 'u21', 'u18', 'youth', 'nyoni', 'danns'],
    'Injuries': ['injury', 'injured', 'fitness', 'sidelined'],
    'FSG': ['fsg', 'fenway', 'henry', 'owners', 'edwards', 'hughes'],
    'Match Report': ['match report', 'player ratings', 'verdict', 'analysis'],
    'Interviews': ['interview', 'quotes', 'spoke to'],
};

const generateTags = (title: string, content: string): string[] => {
    const text = `${title} ${content}`.toLowerCase();
    const tags = new Set<string>();

    Object.entries(TAG_KEYWORDS).forEach(([tag, keywords]) => {
        if (keywords.some(keyword => text.includes(keyword))) {
            tags.add(tag);
        }
    });

    // Limit to 4 tags
    return Array.from(tags).slice(0, 4);
};

const parseDate = (dateStr: string): Date => {
    // Handle SQL-like format YYYY-MM-DD HH:mm:ss returned by rss2json
    if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/.test(dateStr)) {
        return new Date(dateStr.replace(' ', 'T') + 'Z');
    }
    return new Date(dateStr);
};

export const fetchNews = async (): Promise<NewsItem[]> => {
    const promises = SOURCES.map(async (source) => {
        try {
            // Add timestamp to bypass browser caching
            const response = await fetch(`${RSS2JSON_API}${encodeURIComponent(source.url)}&_t=${Date.now()}`);
            const data = await response.json();

            if (data.status !== 'ok') {
                return [];
            }

            return data.items.map((item: any) => {
                let imageUrl = item.thumbnail || item.enclosure?.link;

                // Enhance image quality for Reach PLC sites (Liverpool.com, Echo)
                if (imageUrl && (imageUrl.includes('i2-prod.liverpool.com') || imageUrl.includes('i2-prod.liverpoolecho.co.uk'))) {
                    imageUrl = imageUrl.replace(/\/s\d+\//, '/s1200/');
                }

                // Enhance image quality for The Guardian (remove query params for full size)
                if (imageUrl && imageUrl.includes('i.guim.co.uk')) {
                    imageUrl = imageUrl.split('?')[0];
                }

                // Fallback for Anfield Watch (no images in feed)
                if (!imageUrl && source.name === 'Anfield Watch') {
                    // Use high-quality LFC stock image
                    imageUrl = FALLBACK_IMAGE_URL;
                }

                // Handle Reddit thumbnails
                if (source.name === 'Reddit') {
                    // Reddit often returns "self" or "default" for text posts
                    if (!imageUrl || imageUrl === 'self' || imageUrl === 'default' || imageUrl === 'nsfw') {
                        imageUrl = FALLBACK_IMAGE_URL;
                    }
                }

                const tags = generateTags(item.title || '', item.description || '');

                return {
                    title: item.title,
                    link: item.link || item.enclosure?.link || '',
                    pubDate: item.pubDate,
                    contentSnippet: item.description,
                    content: item.content,
                    source: source.name,
                    isoDate: item.pubDate,
                    enclosure: imageUrl ? { url: imageUrl } : undefined,
                    tags,
                    type: (source as any).type || 'news',
                };
            }) as NewsItem[];
        } catch (error) {
            return [];
        }
    });

    const results = await Promise.all(promises);
    // Flatten and sort by date (newest first)
    return results
        .flat()
        .sort((a, b) => parseDate(b.isoDate || b.pubDate).getTime() - parseDate(a.isoDate || a.pubDate).getTime());
};
