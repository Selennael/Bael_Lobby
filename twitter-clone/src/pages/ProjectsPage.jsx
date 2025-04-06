import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const ProjectCard = ({ project }) => {
  const { id, title, description, thumbnail } = project;
  
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="relative pb-[60%] mb-3 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
        <img 
          src={thumbnail || 'https://via.placeholder.com/300x200?text=Project'} 
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{description}</p>
      <Link 
        to={`/projects/${id}`} 
        className="btn btn-outline text-sm py-1 px-3 inline-flex items-center"
      >
        View Highlights
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </div>
  );
};

const ProjectsPage = () => {
  const { projects, isLoading, error, createProject } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    thumbnail: 'https://via.placeholder.com/300x200'
  });

  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    if (!newProject.title.trim()) return;
    
    try {
      setIsSubmitting(true);
      
      const projectToCreate = {
        id: newProject.title.toLowerCase().replace(/\s+/g, '-'),
        title: newProject.title,
        description: newProject.description,
        thumbnail: newProject.thumbnail,
        createdAt: new Date().toISOString()
      };
      
      const result = await createProject(projectToCreate);
      
      if (result.success) {
        setNewProject({
          title: '',
          description: '',
          thumbnail: 'https://via.placeholder.com/300x200'
        });
        setShowNewProjectForm(false);
      } else {
        console.error('Failed to create project:', result.error);
      }
    } catch (err) {
      console.error('Error creating project:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Projects</h2>
          <button 
            className="btn btn-primary text-sm py-1 px-3 inline-flex items-center"
            onClick={() => setShowNewProjectForm(!showNewProjectForm)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </button>
        </div>
        
        {showNewProjectForm && (
          <div className="card mb-6">
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Create New Project</h3>
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  rows={3}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="btn text-gray-600 mr-2"
                  onClick={() => setShowNewProjectForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting || !newProject.title.trim()}
                >
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length > 0 ? (
              projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                No projects yet. Create your first project!
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProjectsPage;
