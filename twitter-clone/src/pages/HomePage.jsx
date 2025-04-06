import React, { useState } from 'react';
import Layout from '../components/Layout';
import Post from '../components/Post';
import NewPostForm from '../components/NewPostForm';
import { useData } from '../context/DataContext';

const HomePage = () => {
  const { posts, projects, isLoading, error, createPost } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleNewPost = async (newPost) => {
    try {
      setIsSubmitting(true);
      const result = await createPost(newPost);
      if (!result.success) {
        console.error('Failed to create post:', result.error);
      }
    } catch (err) {
      console.error('Error creating post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter posts based on active project filter and search term
  const filteredPosts = posts.filter(post => {
    // Filter by project tag if active
    if (activeFilter && post.projectTag !== activeFilter) {
      return false;
    }
    
    // Filter by search term if present
    if (searchTerm && !post.content.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Get unique project tags from posts
  const projectTags = [...new Set(posts.filter(post => post.projectTag).map(post => post.projectTag))];
  
  // Find project names for tags
  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.title : projectId;
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Home</h2>
          
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search posts..."
              className="pl-8 pr-4 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {/* Project filters */}
        {projectTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                activeFilter === null 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setActiveFilter(null)}
            >
              All Posts
            </button>
            
            {projectTags.map(tag => (
              <button
                key={tag}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  activeFilter === tag 
                    ? 'bg-accent text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setActiveFilter(tag)}
              >
                {getProjectName(tag)}
              </button>
            ))}
          </div>
        )}
        
        <NewPostForm 
          onSubmit={handleNewPost} 
          projects={projects} 
          isSubmitting={isSubmitting}
        />
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            {error}
          </div>
        ) : (
          <div>
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <Post key={post.id} post={post} />
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                {posts.length > 0 
                  ? 'No posts match your current filters.' 
                  : 'No posts yet. Create your first post!'}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;
