import { Octokit } from '@octokit/rest';

// GitHub API configuration
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
const REPO_OWNER = process.env.REACT_APP_REPO_OWNER || 'your-github-username';
const REPO_NAME = process.env.REACT_APP_REPO_NAME || 'twitter-clone-data';
const DATA_PATH = {
  POSTS: 'data/posts.json',
  PROJECTS: 'data/projects.json',
};

// Initialize Octokit
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

/**
 * Get file content from GitHub repository
 * @param {string} path - File path in the repository
 * @returns {Promise<Object>} - Parsed JSON data
 */
export const getFileContent = async (path) => {
  try {
    // If no GitHub token is provided, use local storage instead
    if (!GITHUB_TOKEN) {
      return getLocalData(path);
    }

    const response = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path,
    });

    const content = Buffer.from(response.data.content, 'base64').toString();
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    
    // If file doesn't exist or other error, return empty data
    if (error.status === 404) {
      return path.includes('posts') ? [] : {};
    }
    
    // Fallback to local storage
    return getLocalData(path);
  }
};

/**
 * Update file content in GitHub repository
 * @param {string} path - File path in the repository
 * @param {Object} content - Content to save
 * @param {string} message - Commit message
 * @returns {Promise<Object>} - GitHub API response
 */
export const updateFileContent = async (path, content, message) => {
  try {
    // If no GitHub token is provided, use local storage instead
    if (!GITHUB_TOKEN) {
      return saveLocalData(path, content);
    }

    // Get current file to obtain the SHA
    let sha;
    try {
      const { data } = await octokit.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path,
      });
      sha = data.sha;
    } catch (error) {
      // File doesn't exist yet, which is fine for creating new file
      if (error.status !== 404) {
        throw error;
      }
    }

    // Convert content to base64
    const contentEncoded = Buffer.from(JSON.stringify(content, null, 2)).toString('base64');

    // Update or create file
    const response = await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path,
      message: message || `Update ${path}`,
      content: contentEncoded,
      sha,
    });

    return response;
  } catch (error) {
    console.error(`Error updating ${path}:`, error);
    
    // Fallback to local storage
    return saveLocalData(path, content);
  }
};

/**
 * Get all posts
 * @returns {Promise<Array>} - Array of posts
 */
export const getPosts = async () => {
  return await getFileContent(DATA_PATH.POSTS);
};

/**
 * Get all projects
 * @returns {Promise<Array>} - Array of projects
 */
export const getProjects = async () => {
  return await getFileContent(DATA_PATH.PROJECTS);
};

/**
 * Add a new post
 * @param {Object} post - Post object
 * @returns {Promise<Object>} - Updated posts array
 */
export const addPost = async (post) => {
  const posts = await getPosts();
  const updatedPosts = [post, ...posts];
  await updateFileContent(DATA_PATH.POSTS, updatedPosts, 'Add new post');
  return updatedPosts;
};

/**
 * Add a new project
 * @param {Object} project - Project object
 * @returns {Promise<Object>} - Updated projects array
 */
export const addProject = async (project) => {
  const projects = await getProjects();
  const updatedProjects = [project, ...projects];
  await updateFileContent(DATA_PATH.PROJECTS, updatedProjects, 'Add new project');
  return updatedProjects;
};

/**
 * Get posts by project ID
 * @param {string} projectId - Project ID
 * @returns {Promise<Array>} - Array of posts filtered by project
 */
export const getPostsByProject = async (projectId) => {
  const posts = await getPosts();
  return posts.filter(post => post.projectTag === projectId);
};

/**
 * Get project by ID
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} - Project object
 */
export const getProjectById = async (projectId) => {
  const projects = await getProjects();
  return projects.find(project => project.id === projectId);
};

// Local storage fallback functions
const getLocalData = (path) => {
  const key = path.includes('posts') ? 'posts' : 'projects';
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : (path.includes('posts') ? [] : []);
};

const saveLocalData = (path, content) => {
  const key = path.includes('posts') ? 'posts' : 'projects';
  localStorage.setItem(key, JSON.stringify(content));
  return { success: true, source: 'localStorage' };
};
