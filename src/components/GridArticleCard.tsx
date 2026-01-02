import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { NewsItem } from '../services/rss';
import { getSourceStyles } from '../utils/sourceStyles';
import { Clock } from 'lucide-react';
import { FALLBACK_IMAGE_URL } from '../constants';

interface GridArticleCardProps {
    article: NewsItem;
}

export const GridArticleCard = ({ article }: GridArticleCardProps) => {
    const [imgSrc, setImgSrc] = useState(article.enclosure?.url || FALLBACK_IMAGE_URL);

    useEffect(() => {
        setImgSrc(article.enclosure?.url || FALLBACK_IMAGE_URL);
    }, [article.enclosure?.url]);

    const isFallback = imgSrc === FALLBACK_IMAGE_URL;

    const dateStr = article.isoDate || article.pubDate;
    let timeAgo = 'Recently';
    if (dateStr) {
        try {
            let date = new Date(dateStr);
            if (date > new Date() && /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/.test(dateStr)) {
                date = new Date(dateStr.replace(' ', 'T') + 'Z');
            }
            timeAgo = formatDistanceToNow(date, { addSuffix: true }).replace(/^in /, '').replace(/^about /, '');
        } catch {
            // fallback
        }
    }

    return (
        <article className="flex flex-col group h-full">
            <a href={article.link} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-md mb-4 aspect-[3/2]">
                <img
                    src={imgSrc}
                    alt={article.title}
                    className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${isFallback ? 'object-contain p-4 bg-pattern-dots' : 'object-cover'
                        }`}
                    onError={() => setImgSrc(FALLBACK_IMAGE_URL)}
                />
            </a>

            <div className="flex flex-col flex-1">
                <a href={article.link} target="_blank" rel="noopener noreferrer">
                    <h3 className="text-xl font-bold font-serif text-gray-900 leading-tight mb-2 group-hover:text-lfc-red transition-colors line-clamp-2">
                        {article.title}
                    </h3>
                </a>

                <p className="text-gray-600 text-sm font-serif line-clamp-3 mb-4 flex-1 hidden md:block">
                    {article.contentSnippet?.replace(/<[^>]+>/g, '') || article.content?.replace(/<[^>]+>/g, '').slice(0, 100) + '...'}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${getSourceStyles(article.source)}`}>
                        {article.source}
                    </span>
                    <span className="text-gray-400 text-xs flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {timeAgo}
                    </span>
                </div>
            </div>
        </article>
    );
};
