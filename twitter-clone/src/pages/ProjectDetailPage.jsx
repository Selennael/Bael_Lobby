import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Post from '../components/Post';
import NewPostForm from '../components/NewPostForm';
import { useData } from '../context/DataContext';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const { projects, createPost, getProjectPosts, getProject } = useData();
  const [project, setProject] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setIsLoading(true);
        
        // Get project details
        const projectResult = await getProject(projectId);
        if (!projectResult.success) {
          throw new Error(projectResult.error || 'Failed to fetch project');
        }
        
        // Get project posts
        const postsResult = await getProjectPosts(projectId);
        if (!postsResult.success) {
          throw new Error(postsResult.error || 'Failed to fetch posts');
        }
        
        setProject(projectResult.data);
        setPosts(postsResult.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching project data:', err);
        setError(err.message || 'An error occurred while fetching project data');
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProjectData();
    }
  }, [projectId, getProject, getProjectPosts]);

  const handleNewPost = async (newPost) => {
    try {
      setIsSubmitting(true);
      const result = await createPost(newPost);
      
      if (result.success) {
        // Update local posts state to show the new post immediately
        setPosts([newPost, ...posts]);
      } else {
        console.error('Failed to create post:', result.error);
      }
    } catch (err) {
      console.error('Error creating post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto text-center py-10">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            {error ? 'Error' : 'Project Not Found'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {error || "The project you're looking for doesn't exist."}
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{project.title}</h2>
            <span className="ml-2 bg-accent/10 text-accent px-2 py-1 rounded-full text-xs font-medium">
              #{project.id}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6"></div>
        </div>
        
        <NewPostForm 
          onSubmit={handleNewPost} 
          projects={[project]}
          isSubmitting={isSubmitting}
          defaultProject={project.id}
        />
        
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">Project Updates</h3>
        
        {posts.length > 0 ? (
          posts.map(post => (
            <Post key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            No posts yet for this project. Create your first update!
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProjectDetailPage;
