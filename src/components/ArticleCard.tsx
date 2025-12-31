import { formatDistanceToNow } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import type { NewsItem } from '../services/rss';

interface ArticleCardProps {
    article: NewsItem;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
    // Fallback image if none provided
    const imageUrl = article.enclosure?.url || 'https://resources.premierleague.com/premierleague/photo/2018/01/10/5b36653b-1623-450c-9a00-0363b590c624/Liverpool-Logo.png';

    return (
        <article className="group relative flex flex-col gap-6 border-b border-gray-100 py-10 sm:flex-row sm:items-start">
            <div className="flex-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">
                    <span className="text-lfc-red uppercase tracking-wider">{article.source}</span>
                    <span>•</span>
                    <span>{(() => {
                        const dateStr = article.isoDate || article.pubDate;
                        if (!dateStr) return 'Recently';
                        try {
                            // Handle rss2json format "YYYY-MM-DD HH:mm:ss" which is usually UTC
                            let date = new Date(dateStr);
                            // If parsing as local resulted in future date, try parsing as UTC
                            if (date > new Date() && /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/.test(dateStr)) {
                                date = new Date(dateStr.replace(' ', 'T') + 'Z');
                            }
                            return formatDistanceToNow(date, { addSuffix: true }).replace(/^in /, '');
                        } catch {
                            return 'Recently';
                        }
                    })()}</span>
                </div>

                <a href={article.link} target="_blank" rel="noopener noreferrer" className="group-hover:text-lfc-red transition-colors">
                    <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl font-sans leading-tight">
                        {article.title}
                    </h2>
                </a>

                <p className="mb-4 text-gray-600 line-clamp-3 font-serif text-sm sm:text-base">
                    {article.contentSnippet?.replace(/<[^>]+>/g, '') || article.content?.replace(/<[^>]+>/g, '').slice(0, 150) + '...'}
                </p>

                <div className="flex items-center gap-4">
                    <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                    >
                        Read more <ExternalLink className="h-3 w-3" />
                    </a>
                </div>
            </div>

            <a href={article.link} target="_blank" rel="noopener noreferrer" className="sm:w-48 sm:shrink-0 order-first sm:order-last">
                <div className="aspect-[4/3] overflow-hidden rounded-md bg-gray-100">
                    <img
                        src={imageUrl}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://resources.premierleague.com/premierleague/photo/2018/01/10/5b36653b-1623-450c-9a00-0363b590c624/Liverpool-Logo.png';
                        }}
                    />
                </div>
            </a>
        </article>
    );
};
