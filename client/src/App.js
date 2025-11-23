import React, { useState, useEffect, useCallback, useRef } from 'react';
import ArticleCard from './ArticleCard';
import ArticleModal from './ArticleModal';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const observerTarget = useRef(null);

  const fetchArticles = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/random-articles?count=5');
      if (!response.ok) throw new Error('Failed to fetch articles');
      
      const newArticles = await response.json();
      setArticles(prev => [...prev, ...newArticles]);
      setPage(prev => prev + 1);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Initial load
  useEffect(() => {
    fetchArticles();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Infinite scroll with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading && articles.length > 0) {
          fetchArticles();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchArticles, loading, articles.length]);

  return (
    <div className="app">
      <div className="watermark">
        {[...Array(20)].map((_, rowIndex) => (
          <div key={rowIndex} className="watermark-row">
            {[...Array(10)].map((_, colIndex) => (
              <span key={colIndex} className="watermark-text">
                By Magnus Ryberg
              </span>
            ))}
          </div>
        ))}
      </div>

      <header className="app-header">
        <h1 className="app-title">SmartScroll</h1>
        <p className="app-subtitle">Random Wikipedia Articles</p>
      </header>

      <div className="feed-container">
        {articles.map((article, index) => (
          <ArticleCard 
            key={`${article.pageId}-${index}`} 
            article={article}
            onCardClick={() => setSelectedArticle(article)}
          />
        ))}

        {loading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading articles...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>Error: {error}</p>
            <button className="retry-button" onClick={fetchArticles}>
              Retry
            </button>
          </div>
        )}

        {/* Intersection observer target */}
        <div ref={observerTarget} className="load-more"></div>
      </div>

      {/* Modal */}
      {selectedArticle && (
        <ArticleModal 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
}

export default App;
