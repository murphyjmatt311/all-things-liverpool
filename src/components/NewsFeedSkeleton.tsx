import { Skeleton } from './Skeleton';

export const NewsFeedSkeleton = () => {
    return (
        <div className="py-10">
            {/* Hero Skeleton */}
            <div className="w-full h-[500px] rounded-xl overflow-hidden mb-12 relative">
                <Skeleton className="h-full w-full" />
                <div className="absolute bottom-0 left-0 right-0 p-10 space-y-4">
                    <Skeleton className="h-6 w-32 bg-gray-300" />
                    <Skeleton className="h-10 w-3/4 bg-gray-300" />
                    <Skeleton className="h-4 w-1/2 bg-gray-300" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-gray-100 pt-12">
                {/* Main Content Grid Skeleton */}
                <div className="lg:col-span-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="flex flex-col space-y-3">
                                <Skeleton className="h-48 w-full rounded-lg" />
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                                <div className="flex justify-between mt-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Skeleton */}
                <div className="lg:col-span-4 space-y-12">
                    {/* Most Read Skeleton */}
                    <div>
                        <Skeleton className="h-8 w-32 mb-6" />
                        <div className="space-y-6">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Topics Skeleton */}
                    <div>
                        <Skeleton className="h-8 w-32 mb-6" />
                        <div className="flex flex-wrap gap-2">
                            {[...Array(8)].map((_, i) => (
                                <Skeleton key={i} className="h-8 w-20 rounded-full" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
