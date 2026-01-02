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

const PROXY_URL = 'https://api.allorigins.win/get?url=';

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

const getElementText = (parent: Element, selector: string): string => {
    const element = parent.querySelector(selector);
    return element?.textContent?.trim() || '';
};

const getImageUrl = (item: Element): string | undefined => {
    // Check enclosure
    const enclosure = item.querySelector('enclosure');
    if (enclosure?.getAttribute('type')?.startsWith('image/')) {
        return enclosure.getAttribute('url') || undefined;
    }

    // Check media:content or content:encoded for images
    const mediaContent = item.getElementsByTagName('media:content')[0] || item.getElementsByTagName('content')[0];
    if (mediaContent?.getAttribute('url')) {
        return mediaContent.getAttribute('url') || undefined;
    }

    // Check for images in description/content
    const content = item.querySelector('description')?.textContent || item.querySelector('content\\:encoded')?.textContent || '';
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) return imgMatch[1];

    return undefined;
};

export const fetchNews = async (): Promise<NewsItem[]> => {
    const parser = new DOMParser();

    const promises = SOURCES.map(async (source) => {
        try {
            // Add timestamp to bypass proxy cache
            const targetUrl = `${source.url}${source.url.includes('?') ? '&' : '?'}_t=${Date.now()}`;
            const response = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`);
            const data = await response.json();

            if (!data.contents) return [];

            const xml = parser.parseFromString(data.contents, 'text/xml');
            const items = Array.from(xml.querySelectorAll('item, entry'));

            return items.map((item) => {
                const title = getElementText(item, 'title');
                const link = item.querySelector('link')?.getAttribute('href') || getElementText(item, 'link');
                const pubDate = getElementText(item, 'pubDate') || getElementText(item, 'published') || getElementText(item, 'updated');
                const description = getElementText(item, 'description') || getElementText(item, 'summary');
                const content = getElementText(item, 'content\\:encoded') || getElementText(item, 'content');

                let imageUrl = getImageUrl(item);

                // Enhance image quality for Reach PLC sites (Liverpool.com, Echo)
                if (imageUrl && (imageUrl.includes('i2-prod.liverpool.com') || imageUrl.includes('i2-prod.liverpoolecho.co.uk'))) {
                    imageUrl = imageUrl.replace(/\/s\d+\//, '/s1200/');
                }

                // Enhance image quality for The Guardian
                if (imageUrl && imageUrl.includes('i.guim.co.uk')) {
                    imageUrl = imageUrl.split('?')[0];
                }

                // Fallback for Anfield Watch
                if (!imageUrl && source.name === 'Anfield Watch') {
                    imageUrl = FALLBACK_IMAGE_URL;
                }

                // Handle Reddit thumbnails
                if (source.name === 'Reddit') {
                    const thumbnail = item.getElementsByTagName('thumbnail')[0]?.getAttribute('url');
                    if (thumbnail && !['self', 'default', 'nsfw'].includes(thumbnail)) {
                        imageUrl = thumbnail;
                    } else {
                        imageUrl = FALLBACK_IMAGE_URL;
                    }
                }

                const tags = generateTags(title, description);

                return {
                    title,
                    link,
                    pubDate,
                    contentSnippet: description,
                    content,
                    source: source.name,
                    isoDate: pubDate,
                    enclosure: imageUrl ? { url: imageUrl } : undefined,
                    tags,
                    type: (source as any).type || 'news',
                };
            });
        } catch (error) {
            console.error(`Error fetching ${source.name}:`, error);
            return [];
        }
    });

    const results = await Promise.all(promises);
    return results
        .flat()
        .filter(item => item.title && item.link)
        .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
};
