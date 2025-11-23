import React, { useState } from 'react';
import './ArticleCard.css';

const ArticleCard = ({ article, onCardClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 500;
  
  const shouldTruncate = article.extract && article.extract.length > maxLength;
  const displayText = shouldTruncate && !isExpanded 
    ? article.extract.substring(0, maxLength) + '...'
    : article.extract;

  const handleCardClick = (e) => {
    // Don't open modal if clicking on buttons or links
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
      return;
    }
    onCardClick();
  };

  return (
    <div className="article-card" onClick={handleCardClick}>
      {article.thumbnail ? (
        <img 
          src={article.thumbnail} 
          alt={article.title}
          className="article-image"
        />
      ) : (
        <div className="placeholder-image">
          No image available
        </div>
      )}
      
      <div className="article-content">
        <h2 className="article-title">{article.title}</h2>
        <p className="article-text">{displayText}</p>
        
        {shouldTruncate && (
          <button 
            className="expand-button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
        
        {isExpanded && (
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="read-more-link"
            onClick={(e) => e.stopPropagation()}
          >
            View full article on Wikipedia →
          </a>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;
