import { useParams, Link } from 'react-router-dom';
import { useNews } from '../hooks/useNews';
import { GridArticleCard } from './GridArticleCard';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

export const TopicPage = () => {
    const { topicId } = useParams();
    const { data: news, isLoading, error } = useNews();
    const decodedTopic = decodeURIComponent(topicId || '');

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-lfc-red" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Unable to load topic</h3>
            </div>
        );
    }

    const filteredArticles = news?.filter(article => article.tags.includes(decodedTopic)) || [];

    return (
        <div className="py-10">
            <div className="mb-8">
                <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-lfc-red transition-colors mb-4">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to Feed
                </Link>
                <h1 className="text-3xl font-bold font-serif text-gray-900">
                    Topic: <span className="text-lfc-red">{decodedTopic}</span>
                </h1>
                <p className="text-gray-500 mt-2">
                    {filteredArticles.length} articles found
                </p>
            </div>

            {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {filteredArticles.map((article) => (
                        <GridArticleCard key={article.link} article={article} />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center text-gray-500 bg-gray-50 rounded-lg">
                    No recent articles found for this topic.
                </div>
            )}
        </div>
    );
};
