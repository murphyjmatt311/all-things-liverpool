import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { NewsItem } from '../services/rss';
import { getSourceStyles } from '../utils/sourceStyles';
import { Clock } from 'lucide-react';
import { FALLBACK_IMAGE_URL } from '../constants';
import { MatchBanner } from './MatchBanner';

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
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                timeAgo = formatDistanceToNow(date, { addSuffix: true }).replace(/^in /, '').replace(/^about /, '');
            }
        } catch {
            // fallback
        }
    }

    return (
        <article className="flex flex-col h-full gap-4">
            {/* Match Banner */}
            <MatchBanner />

            {/* Hero Image */}
            <div className="order-1 w-full">
                <a href={article.link} target="_blank" rel="noopener noreferrer" className="block w-full overflow-hidden rounded-lg shadow-sm aspect-[16/9]">
                    <img
                        src={imgSrc}
                        alt={article.title}
                        className={`h-full w-full transition-transform duration-700 hover:scale-105 ${isFallback ? 'object-contain p-8 bg-pattern-dots' : 'object-cover'
                            }`}
                        onError={() => setImgSrc(FALLBACK_IMAGE_URL)}
                    />
                </a>
            </div>

            {/* Text Content */}
            <div className="flex flex-col order-2 flex-1">
                <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${getSourceStyles(article.source)}`}>
                        {article.source}
                    </span>
                    <span className="text-gray-400 text-sm font-medium flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {timeAgo}
                    </span>
                </div>

                <a href={article.link} target="_blank" rel="noopener noreferrer" className="group">
                    <h2 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 leading-tight mb-3 group-hover:text-lfc-red transition-colors">
                        {article.title}
                    </h2>
                </a>

                {(() => {
                    const summaryText = article.contentSnippet?.replace(/<[^>]+>/g, '') || article.content?.replace(/<[^>]+>/g, '').slice(0, 200) + '...';
                    const isValidSummary = summaryText && summaryText.length > 3 && summaryText !== '...';

                    return isValidSummary ? (
                        <p className="text-gray-600 font-serif text-lg leading-relaxed mb-6 line-clamp-3">
                            {summaryText}
                        </p>
                    ) : null;
                })()}


            </div>
        </article>
    );
};
