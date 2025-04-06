import React from 'react';
import { Link } from 'react-router-dom';

const Post = ({ post }) => {
  const { content, author, timestamp, projectTag, likes } = post;
  
  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  // Convert URLs to clickable links and handle markdown-style links
  const renderContent = (text) => {
    // Replace markdown links [text](url)
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let processedText = text.replace(markdownLinkRegex, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Replace plain URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    processedText = processedText.replace(urlRegex, (url) => {
      if (!markdownLinkRegex.test(url)) {
        return `<a href="${url}" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">${url}</a>`;
      }
      return url;
    });
    
    // Replace markdown bold **text**
    const boldRegex = /\*\*([^*]+)\*\*/g;
    processedText = processedText.replace(boldRegex, '<strong>$1</strong>');
    
    // Replace markdown italic *text*
    const italicRegex = /\*([^*]+)\*/g;
    processedText = processedText.replace(italicRegex, '<em>$1</em>');
    
    return { __html: processedText };
  };

  return (
    <div className="card mb-4 border border-gray-200 dark:border-gray-700 hover:border-primary transition-colors">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
            {author.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <h3 className="font-bold text-gray-900 dark:text-white">{author}</h3>
            <span className="mx-1 text-gray-500">·</span>
            <span className="text-gray-500 text-sm">{formatDate(timestamp)}</span>
          </div>
          
          <div className="mb-2 text-gray-800 dark:text-gray-200">
            <div dangerouslySetInnerHTML={renderContent(content)} />
          </div>
          
          {projectTag && (
            <div className="mb-3">
              <Link to={`/projects/${projectTag}`} className="inline-block bg-accent/10 text-accent px-2 py-1 rounded-full text-xs font-medium hover:bg-accent/20 transition-colors">
                #{projectTag}
              </Link>
            </div>
          )}
          
          <div className="flex items-center text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-700">
            <button className="flex items-center mr-4 hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Reply</span>
            </button>
            
            <button className="flex items-center mr-4 hover:text-accent transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Repost</span>
            </button>
            
            <button className="flex items-center hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{likes || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
