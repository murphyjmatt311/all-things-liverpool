import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { NewsItem } from '../services/rss';
import { getSourceStyles } from '../utils/sourceStyles';
import { Clock } from 'lucide-react';
import { FALLBACK_IMAGE_URL } from '../constants';

interface HeroArticleProps {
    article: NewsItem;
}

export const HeroArticle = ({ article }: HeroArticleProps) => {
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
        <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
            {/* Text Content */}
            <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="flex items-center space-x-2 mb-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${getSourceStyles(article.source)}`}>
                        {article.source}
                    </span>
                    <span className="text-white/80 text-sm font-medium flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {timeAgo}
                    </span>
                </div>

                <a href={article.link} target="_blank" rel="noopener noreferrer" className="group">
                    <h2 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight mb-4 group-hover:text-lfc-red transition-colors">
                        {article.title}
                    </h2>
                </a>

                <p className="text-gray-600 font-serif text-lg leading-relaxed mb-6 line-clamp-3">
                    {article.contentSnippet?.replace(/<[^>]+>/g, '') || article.content?.replace(/<[^>]+>/g, '').slice(0, 200) + '...'}
                </p>

                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                        {/* Placeholder Avatar */}
                        <div className="h-full w-full bg-lfc-teal/10 flex items-center justify-center text-lfc-teal font-bold text-xs">
                            {article.source.substring(0, 2)}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{article.source}</span>
                        <span className="text-xs text-gray-500">{timeAgo}</span>
                    </div>
                </div>
            </div>

            {/* Hero Image */}
            <div className="lg:col-span-7 order-1 lg:order-2">
                <a href={article.link} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-lg shadow-sm aspect-[16/10]">
                    <img
                        src={imgSrc}
                        alt={article.title}
                        className={`h-full w-full transition-transform duration-700 hover:scale-105 ${isFallback ? 'object-contain p-8 bg-white' : 'object-cover'
                            }`}
                        onError={() => setImgSrc(FALLBACK_IMAGE_URL)}
                    />
                </a>
            </div>
        </article>
    );
};
