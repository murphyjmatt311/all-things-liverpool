import { Mic } from 'lucide-react';
import type { NewsItem } from '../services/rss';

interface PodcastSectionProps {
    podcasts: NewsItem[];
}

export const PodcastSection = ({ podcasts }: PodcastSectionProps) => {
    if (!podcasts || podcasts.length === 0) return null;

    return (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold font-serif text-gray-900 mb-4 flex items-center">
                <Mic className="h-5 w-5 mr-2 text-lfc-red" />
                Listen
            </h3>
            <div className="space-y-4">
                {podcasts.slice(0, 5).map((podcast) => (
                    <a
                        key={podcast.link}
                        href={podcast.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block"
                    >
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-lfc-red transition-colors leading-snug mb-1 line-clamp-2">
                            {podcast.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                            <span className="font-bold text-gray-700 mr-2">{podcast.source}</span>
                            <span>{new Date(podcast.isoDate || podcast.pubDate).toLocaleDateString()}</span>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};
