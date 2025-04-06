import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  getPosts, 
  getProjects, 
  addPost, 
  addProject, 
  getPostsByProject, 
  getProjectById 
} from '../utils/githubStorage';

// Create context
const DataContext = createContext();

// Provider component
export const DataProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [postsData, projectsData] = await Promise.all([
          getPosts(),
          getProjects()
        ]);
        
        setPosts(postsData || []);
        setProjects(projectsData || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Create a new post
  const createPost = async (newPost) => {
    try {
      const updatedPosts = await addPost(newPost);
      setPosts(updatedPosts);
      return { success: true, data: updatedPosts };
    } catch (err) {
      console.error('Error creating post:', err);
      return { success: false, error: err.message };
    }
  };

  // Create a new project
  const createProject = async (newProject) => {
    try {
      const updatedProjects = await addProject(newProject);
      setProjects(updatedProjects);
      return { success: true, data: updatedProjects };
    } catch (err) {
      console.error('Error creating project:', err);
      return { success: false, error: err.message };
    }
  };

  // Get posts for a specific project
  const getProjectPosts = async (projectId) => {
    try {
      const projectPosts = await getPostsByProject(projectId);
      return { success: true, data: projectPosts };
    } catch (err) {
      console.error('Error fetching project posts:', err);
      return { success: false, error: err.message };
    }
  };

  // Get a specific project
  const getProject = async (projectId) => {
    try {
      const project = await getProjectById(projectId);
      return { success: true, data: project };
    } catch (err) {
      console.error('Error fetching project:', err);
      return { success: false, error: err.message };
    }
  };

  // Context value
  const value = {
    posts,
    projects,
    isLoading,
    error,
    createPost,
    createProject,
    getProjectPosts,
    getProject
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
