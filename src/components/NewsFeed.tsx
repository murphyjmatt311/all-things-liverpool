import { useNews } from '../hooks/useNews';
import { HeroArticle } from './HeroArticle';
import { GridArticleCard } from './GridArticleCard';
import { NewsFeedSkeleton } from './NewsFeedSkeleton';
import { PodcastSection } from './PodcastSection';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';

export const NewsFeed = () => {
    const { data: allNews, isLoading, error } = useNews();
    const [isTopicsExpanded, setIsTopicsExpanded] = useState(false);
    const [visibleCount, setVisibleCount] = useState(9); // Initial grid count

    const { mainNews, redditNews, podcasts } = useMemo(() => {
        if (!allNews) return { mainNews: [], redditNews: [], podcasts: [] };
        return {
            mainNews: allNews.filter(item => item.source !== 'Reddit' && item.type !== 'podcast'),
            redditNews: allNews.filter(item => item.source === 'Reddit'),
            podcasts: allNews.filter(item => item.type === 'podcast')
        };
    }, [allNews]);

    const popularTopics = useMemo(() => {
        if (!mainNews) return [];

        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        const topicCounts: Record<string, number> = {};

        mainNews.forEach(article => {
            const pubDate = new Date(article.isoDate || article.pubDate);

            // Filter by date (last 2 weeks)
            if (pubDate >= twoWeeksAgo) {
                article.tags.forEach(tag => {
                    topicCounts[tag] = (topicCounts[tag] || 0) + 1;
                });
            }
        });

        return Object.entries(topicCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 50) // Get top 50
            .map(([tag]) => tag);
    }, [mainNews]);

    const displayedTopics = isTopicsExpanded ? popularTopics : popularTopics.slice(0, 8);

    if (isLoading) {
        return <NewsFeedSkeleton />;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Unable to load news</h3>
                <p className="text-gray-500 mt-2">Please check your connection and try again.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 rounded-full bg-lfc-red px-6 py-2 text-white hover:bg-red-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!mainNews || mainNews.length === 0) {
        return (
            <div className="py-20 text-center text-gray-500">
                No news available at the moment.
            </div>
        );
    }

    const heroArticle = mainNews[0];
    const featuredArticles = mainNews.slice(1, 3); // Next 2 articles for the "Bento Box" stack
    const gridArticles = mainNews.slice(3, 3 + visibleCount); // Remaining articles for the grid
    const sidebarArticles = mainNews.slice(10, 15); // Keep sidebar static or independent

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 9);
    };

    return (
        <div className="py-6 lg:py-8">
            {/* Desktop Header: Bento Box Layout (Hero + 2 Stacked) */}
            <div className="hidden lg:grid grid-cols-3 gap-8 mb-8">
                {/* Left Column: Hero Article (Takes 2/3) */}
                <div className="col-span-2">
                    <HeroArticle article={heroArticle} />
                </div>

                {/* Right Column: Stacked Articles (Takes 1/3) */}
                <div className="col-span-1 flex flex-col gap-8">
                    {featuredArticles.map(article => (
                        <GridArticleCard key={article.link} article={article} hideSummary={true} />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4 lg:border-t lg:border-gray-100 lg:pt-8">
                {/* Main Content Grid */}
                <div className="lg:col-span-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                        {/* Mobile only: First 3 articles as standard cards */}
                        <div className="contents lg:hidden">
                            <GridArticleCard article={heroArticle} />
                            {featuredArticles.map(article => (
                                <GridArticleCard key={article.link} article={article} />
                            ))}
                        </div>

                        {gridArticles.map((article) => (
                            <GridArticleCard key={article.link} article={article} />
                        ))}
                    </div>

                    {/* Load More Button */}
                    {mainNews.length > 1 + visibleCount && (
                        <div className="mt-12 text-center">
                            <button
                                onClick={handleLoadMore}
                                className="px-8 py-3 bg-white border border-gray-200 text-gray-900 font-medium rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                            >
                                Load More News
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-12">

                    {/* Hot on Reddit Section */}
                    {redditNews.length > 0 && (
                        <div className="bg-[#FF4500]/5 rounded-xl p-6 border border-[#FF4500]/10">
                            <h3 className="text-lg font-bold font-serif text-[#FF4500] mb-4 flex items-center">
                                <span className="mr-2">🔥</span> Hot on r/LiverpoolFC/
                            </h3>
                            <div className="space-y-4">
                                {redditNews.slice(0, 5).map((article) => (
                                    <a
                                        key={article.link}
                                        href={article.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group block"
                                    >
                                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-[#FF4500] transition-colors leading-snug mb-1 line-clamp-2">
                                            {article.title}
                                        </h4>

                                    </a>
                                ))}
                            </div>
                        </div>
                    )}



                    {/* Podcasts Section */}
                    <PodcastSection podcasts={podcasts} />

                    {/* More Headlines Section */}
                    <div>
                        <h3 className="text-lg font-bold font-serif text-gray-900 mb-6 border-b border-gray-200 pb-2">
                            More Headlines
                        </h3>
                        <div className="space-y-6">
                            {sidebarArticles.map((article) => (
                                <a
                                    key={article.link}
                                    href={article.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block"
                                >
                                    <h4 className="text-base font-medium text-gray-900 group-hover:text-lfc-red transition-colors leading-snug mb-1">
                                        {article.title}
                                    </h4>
                                    <span className="text-xs text-gray-500">{article.source}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Topics Section */}
                    <div>
                        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                            <h3 className="text-lg font-bold font-serif text-gray-900">
                                Popular Topics
                            </h3>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {displayedTopics.map((topic) => (
                                <Link
                                    key={topic}
                                    to={`/topic/${encodeURIComponent(topic)}`}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-lfc-red hover:text-white transition-colors"
                                >
                                    {topic}
                                </Link>
                            ))}
                        </div>

                        {popularTopics.length > 8 && (
                            <button
                                onClick={() => setIsTopicsExpanded(!isTopicsExpanded)}
                                className="mt-4 flex items-center text-sm text-lfc-red hover:text-red-800 font-medium transition-colors"
                            >
                                {isTopicsExpanded ? (
                                    <>
                                        Show Less <ChevronUp className="ml-1 h-4 w-4" />
                                    </>
                                ) : (
                                    <>
                                        Expand <ChevronDown className="ml-1 h-4 w-4" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>


                </div>
            </div>
        </div>
    );
};
