import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { NewsFeed } from './components/NewsFeed';
import { TopicPage } from './components/TopicPage';
import { ErrorBoundary } from './components/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen pb-20">
          <div className="bg-white max-w-screen-xl mx-auto shadow-sm min-h-screen">
            <Header />
            <main className="px-4 sm:px-6 lg:px-8">
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<NewsFeed />} />
                  <Route path="/topic/:topicId" element={<TopicPage />} />
                </Routes>
              </ErrorBoundary>
            </main>
            <footer className="mt-20 border-t border-gray-100 py-10 text-center text-sm text-gray-500 font-serif">
              <p>© {new Date().getFullYear()} All Things Liverpool.</p>
              <p className="mt-2">YNWA</p>
            </footer>
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
