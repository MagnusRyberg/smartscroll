import React, { useEffect, useState } from 'react';
import './ArticleModal.css';

const ArticleModal = ({ article, onClose }) => {
  const [fullArticle, setFullArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch full article content
  useEffect(() => {
    const fetchFullArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/article/${encodeURIComponent(article.title)}`);
        const html = await response.text();
        setFullArticle(html);
      } catch (error) {
        console.error('Error fetching full article:', error);
        setFullArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFullArticle();
  }, [article.title]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // Close modal when clicking on overlay
  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-close">
          <h2 className="modal-title">{article.title}</h2>
          <button className="modal-close-button" onClick={onClose}>
            ×
          </button>
        </div>

        {article.thumbnail && (
          <img 
            src={article.thumbnail} 
            alt={article.title}
            className="modal-image"
          />
        )}

        <div className="modal-body">
          {loading ? (
            <div className="loading-article">
              <div className="loading-article-spinner"></div>
              <p>Loading full article...</p>
            </div>
          ) : fullArticle ? (
            <div 
              className="modal-full-article"
              dangerouslySetInnerHTML={{ __html: fullArticle }}
            />
          ) : (
            <p className="modal-text">{article.extract}</p>
          )}
          
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="modal-wiki-link"
          >
            View on Wikipedia →
          </a>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
