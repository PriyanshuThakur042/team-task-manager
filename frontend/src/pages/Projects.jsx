import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Plus, Edit2, Trash2, Users, Calendar, Loader2, X, FolderKanban } from 'lucide-react';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    _id: '',
    title: '',
    description: '',
    members: [],
  });

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchProjects();
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const openModal = (project = null) => {
    if (project) {
      setIsEditing(true);
      setFormData({
        _id: project._id,
        title: project.title,
        description: project.description,
        members: project.members.map(m => m._id || m),
      });
    } else {
      setIsEditing(false);
      setFormData({ _id: '', title: '', description: '', members: [] });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ _id: '', title: '', description: '', members: [] });
  };

  const handleMemberToggle = (userId) => {
    setFormData(prev => {
      const members = prev.members.includes(userId)
        ? prev.members.filter(id => id !== userId)
        : [...prev.members, userId];
      return { ...prev, members };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/projects/${formData._id}`, {
          title: formData.title,
          description: formData.description,
          members: formData.members
        });
      } else {
        await api.post('/projects', {
          title: formData.title,
          description: formData.description,
          members: formData.members
        });
      }
      fetchProjects();
      closeModal();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Projects</h1>
          <p className="text-slate-500 mt-1">Manage and view all your team projects.</p>
        </div>
        
        {isAdmin && (
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 shadow-sm">
          <FolderKanban className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="text-lg font-medium text-slate-600">No projects found.</p>
          {isAdmin && <p className="text-sm mt-1">Create a new project to get started.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all group flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                  <FolderKanban className="w-6 h-6" />
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal(project)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(project._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-2">{project.title}</h3>
              <p className="text-slate-500 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">{project.description}</p>
              
              <div className="border-t border-slate-100 pt-5 mt-auto">
                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">{project.members?.length || 0} Members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                {/* Member avatars */}
                {project.members && project.members.length > 0 && (
                  <div className="flex items-center -space-x-2 overflow-hidden">
                    {project.members.slice(0, 5).map((member, i) => (
                      <div key={member._id || i} title={member.name} className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm relative z-10 hover:z-20 transition-transform hover:scale-110">
                        {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    ))}
                    {project.members.length > 5 && (
                      <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-slate-600 text-xs font-bold shrink-0 shadow-sm relative z-0">
                        +{project.members.length - 5}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-blue-600" />
                {isEditing ? 'Edit Project' : 'Create New Project'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium"
                    placeholder="E.g. Website Redesign"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                  <textarea
                    required
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-700 resize-none font-medium"
                    placeholder="What is this project about?"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Assign Members</label>
                  <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-2 space-y-1">
                    {users.map(u => (
                      <label key={u._id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white hover:shadow-sm cursor-pointer transition-all border border-transparent hover:border-slate-200">
                        <input
                          type="checkbox"
                          checked={formData.members.includes(u._id)}
                          onChange={() => handleMemberToggle(u._id)}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-700">{u.name}</span>
                          <span className="text-xs text-slate-500 font-medium">{u.email} • <span className="capitalize text-blue-600">{u.role}</span></span>
                        </div>
                      </label>
                    ))}
                    {users.length === 0 && <p className="text-sm text-slate-500 p-4 text-center font-medium">No team members available.</p>}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-lg shadow-blue-500/20">
                  {isEditing ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
