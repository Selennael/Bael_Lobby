import React, { useState, useEffect } from 'react';

const NewPostForm = ({ onSubmit, projects = [], isSubmitting = false, defaultProject = '' }) => {
  const [content, setContent] = useState('');
  const [selectedProject, setSelectedProject] = useState(defaultProject);
  const [isExpanded, setIsExpanded] = useState(!!defaultProject);
  const [draftKey] = useState(`post_draft_${defaultProject || 'main'}`);
  
  // Load draft from localStorage on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      setContent(savedDraft);
      if (!isExpanded && savedDraft.length > 0) {
        setIsExpanded(true);
      }
    }
  }, [draftKey, isExpanded]);
  
  // Save draft to localStorage when content changes
  useEffect(() => {
    if (content.trim()) {
      localStorage.setItem(draftKey, content);
    } else {
      localStorage.removeItem(draftKey);
    }
  }, [content, draftKey]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    const newPost = {
      id: Date.now().toString(),
      content: content.trim(),
      author: 'You', // In a real app, this would come from auth
      timestamp: new Date().toISOString(),
      projectTag: selectedProject || null,
      likes: 0
    };
    
    onSubmit(newPost);
    setContent('');
    localStorage.removeItem(draftKey);
    
    if (!defaultProject) {
      setSelectedProject('');
      setIsExpanded(false);
    }
  };
  
  const handleDiscard = () => {
    setContent('');
    localStorage.removeItem(draftKey);
    if (!defaultProject) {
      setIsExpanded(false);
    }
  };
  
  return (
    <div className="card mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex">
          <div className="flex-shrink-0 mr-3">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              Y
            </div>
          </div>
          <div className="flex-1">
            <textarea
              className="w-full border-0 focus:ring-0 text-lg placeholder-gray-400 tracking-wide min-h-[50px] text-gray-800 dark:text-white dark:bg-gray-800"
              placeholder="What's happening?"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (!isExpanded && e.target.value.length > 0) {
                  setIsExpanded(true);
                }
              }}
              rows={isExpanded ? 3 : 1}
              disabled={isSubmitting}
            />
            
            {isExpanded && (
              <div>
                <div className="text-xs text-gray-500 mb-2">
                  <span>Supports markdown: **bold**, *italic*, [link](url)</span>
                  {content.length > 0 && (
                    <span className="float-right">Draft saved</span>
                  )}
                </div>
                
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <div>
                    {projects.length > 0 && (
                      <select
                        className="border border-gray-300 dark:border-gray-600 rounded-full px-3 py-1 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        disabled={isSubmitting || !!defaultProject}
                      >
                        <option value="">No project</option>
                        {projects.map(project => (
                          <option key={project.id} value={project.id}>
                            {project.title}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      type="button" 
                      className="btn text-gray-600 dark:text-gray-300"
                      onClick={handleDiscard}
                      disabled={isSubmitting || !content.trim()}
                    >
                      Discard
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isSubmitting || !content.trim()}
                    >
                      {isSubmitting ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewPostForm;
