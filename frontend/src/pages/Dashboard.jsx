import React, { useEffect, useState } from 'react';
import { sendApiRequest } from '../services/api';
import { useDispatch } from 'react-redux';
import { openModal } from '../slices/modalSlice';
import CreateProjectForm from '../components/project/CreateProjectForm';
import UpdateProjectForm from '../components/project/UpdateProjectForm';
import DeleteProjectConfirm from '../components/project/DeleteProjectConfirm';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const FREEPIK_IMAGES = [
  'https://img.freepik.com/free-photo/majestic-mountain-landscape_181624-46399.jpg',
  'https://img.freepik.com/free-photo/beautiful-shot-mountain-landscape-with-greenery-cloudy-sky_181624-26647.jpg',
  'https://img.freepik.com/free-photo/beautiful-shot-mountain-landscape_181624-26646.jpg',
  'https://img.freepik.com/free-photo/beautiful-shot-mountain-landscape-with-greenery-cloudy-sky_181624-26647.jpg',
  'https://img.freepik.com/free-photo/majestic-mountain-landscape_181624-46399.jpg',
];

const getRandomImage = () => FREEPIK_IMAGES[Math.floor(Math.random() * FREEPIK_IMAGES.length)];

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchProjects = () => {
    setLoading(true);
    sendApiRequest('get', '/api/project')
      .then(res => {
        if (res.success && Array.isArray(res.projects)) {
          setProjects(res.projects);
        } else {
          setProjects([]);
        }
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = () => {
    dispatch(openModal(<CreateProjectForm onSuccess={fetchProjects} />));
  };

  const handleUpdateProject = (project) => {
    dispatch(openModal(<UpdateProjectForm project={project} onSuccess={fetchProjects} />));
  };

  const handleDeleteProject = (project) => {
    dispatch(openModal(<DeleteProjectConfirm project={project} onSuccess={fetchProjects} />));
  };

  const handleProjectClick = (projectId) => {
    navigate(`/dashboard/project/${projectId}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-lg font-semibold mb-4" style={{ color: '#172b4d' }}>Projects</h2>
      <div className="flex flex-wrap gap-6">
        <div
          className="flex flex-col items-center justify-center rounded-md cursor-pointer border-2 border-dashed border-[#b6bbbf] bg-[#f4f5f7] hover:bg-[#e4f0f6]"
          style={{ width: 260, height: 96, minWidth: 260 }}
          onClick={handleCreateProject}
        >
          <span className="text-2xl mb-1" style={{ color: '#5e6c84' }}>+</span>
          <span className="font-medium text-sm" style={{ color: '#5e6c84' }}>Create New Project</span>
        </div>
        {loading ? (
          <div className="text-center py-8 w-full">Loading...</div>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="rounded-md shadow-md cursor-pointer flex flex-col justify-end relative overflow-hidden group"
              style={{ width: 260, height: 96, minWidth: 260, background: '#bcd9ea' }}
              onClick={() => handleProjectClick(project._id)}
            >
              <img
                src={getRandomImage()}
                alt="cover"
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-90 transition duration-200"
                style={{ zIndex: 1 }}
              />
              <div className="relative z-10 p-3 flex items-center justify-between">
                <span className="font-semibold text-base text-white drop-shadow" style={{ textShadow: '0 1px 2px #0006' }}>{project.title}</span>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateProject(project);
                    }}
                    className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded p-1 flex items-center justify-center"
                    style={{ color: '#0c66e4' }}
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project);
                    }}
                    className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded p-1 flex items-center justify-center"
                    style={{ color: '#e11d48' }}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard; 