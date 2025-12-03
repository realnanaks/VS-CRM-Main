import React, { useState, useEffect } from 'react';
import { Plus, Layout, List, Calendar, Clock, MoreHorizontal, CheckCircle2, ChevronRight, ArrowRight, X, GripVertical, Settings } from 'lucide-react';
import { Project, CountryCode, ProjectColumn, ProjectTask } from '../types';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { retrieveDashboardData, addProject, updateProject, subscribeToStateChanges } from '../services/data';
import { cn } from '../utils/cn';

interface ProjectsProps {
  country: CountryCode;
}

export const Projects: React.FC<ProjectsProps> = ({ country }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Create Project State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  // Edit Project State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editProgress, setEditProgress] = useState(0);

  // Drag and Drop State
  const [draggedItem, setDraggedItem] = useState<{ taskId: string; colId: string } | null>(null);

  // Add Column State
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  useEffect(() => {
    const update = () => {
      const currentProjects = retrieveDashboardData(country).projects;
      setProjects(currentProjects);
      // If a project is selected, update it from the store to keep it in sync
      if (selectedProject) {
        const updated = currentProjects.find(p => p.id === selectedProject.id);
        if (updated) setSelectedProject(updated);
      }
    };
    update();
    return subscribeToStateChanges(update);
  }, [country, selectedProject?.id]);

  // --- Actions ---

  const handleCreateProject = () => {
    if (!newName) return;

    const newProject: Project = {
      id: Date.now().toString(),
      name: newName,
      description: newDesc,
      status: 'Planning',
      progress: 0,
      dueDate: newDueDate || new Date().toISOString().split('T')[0],
      members: ['https://picsum.photos/40/40?random=100'], // Default current user
      country: country === 'Global' ? 'US' : country,
      columns: [
        { id: 'c1', title: 'To Do', tasks: [] },
        { id: 'c2', title: 'In Progress', tasks: [] },
        { id: 'c3', title: 'Done', tasks: [] }
      ]
    };

    addProject(newProject);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewName('');
    setNewDesc('');
    setNewDueDate('');
  };

  const handleEditClick = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the project details
    setEditingProject(project);
    setEditProgress(project.progress);
  };

  const handleUpdateProgress = () => {
    if (!editingProject) return;
    updateProject({ ...editingProject, progress: editProgress });
    setEditingProject(null);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string, colId: string) => {
    setDraggedItem({ taskId, colId });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, targetColId: string) => {
    e.preventDefault();
    if (!draggedItem || !selectedProject) return;

    const { taskId, colId: sourceColId } = draggedItem;
    if (sourceColId === targetColId) return;

    // Create deep copy of project to update
    const projectCopy = JSON.parse(JSON.stringify(selectedProject)) as Project;
    const sourceCol = projectCopy.columns.find(c => c.id === sourceColId);
    const targetCol = projectCopy.columns.find(c => c.id === targetColId);

    if (sourceCol && targetCol) {
      const taskIndex = sourceCol.tasks.findIndex((t: ProjectTask) => t.id === taskId);
      if (taskIndex > -1) {
        const [task] = sourceCol.tasks.splice(taskIndex, 1);
        targetCol.tasks.push(task);

        // Persist update
        updateProject(projectCopy);
        setSelectedProject(projectCopy);
      }
    }
    setDraggedItem(null);
  };

  const handleAddColumn = () => {
    if (!newColumnTitle || !selectedProject) return;

    const newCol: ProjectColumn = {
      id: Date.now().toString(),
      title: newColumnTitle,
      tasks: []
    };

    const updatedProject = {
      ...selectedProject,
      columns: [...selectedProject.columns, newCol]
    };

    updateProject(updatedProject);
    setSelectedProject(updatedProject);
    setNewColumnTitle('');
    setIsAddingColumn(false);
  };

  // --- Render ---

  if (selectedProject) {
    return (
      <div className="h-[calc(100vh-140px)] flex flex-col space-y-4">
        {/* Project Header */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button onClick={() => setSelectedProject(null)} className="text-gray-400 hover:text-indigo-600 text-sm font-medium">Projects</button>
              <ChevronRight size={14} className="text-gray-300" />
              <h1 className="text-xl font-bold text-gray-900">{selectedProject.name}</h1>
            </div>
            <p className="text-sm text-gray-500">{selectedProject.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {selectedProject.members.map((m, i) => (
                <img key={i} src={m} alt="" className="w-8 h-8 rounded-full border-2 border-white" />
              ))}
              <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 border-2 border-white hover:bg-gray-200">+</button>
            </div>
            <Button variant="secondary" size="sm" onClick={(e) => handleEditClick(selectedProject, e)}>
              <Settings size={16} className="mr-2" /> Settings
            </Button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex h-full gap-6 pb-4 min-w-max">
            {selectedProject.columns.map(col => (
              <div
                key={col.id}
                className="w-80 flex flex-col bg-slate-100/50 rounded-xl border border-gray-200/60 max-h-full"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {/* Column Header */}
                <div className="p-3 flex items-center justify-between border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                  <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                    {col.title}
                    <span className="bg-gray-200 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-full">{col.tasks.length}</span>
                  </h3>
                  <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={16} /></button>
                </div>

                {/* Tasks List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-hide">
                  {col.tasks.map(task => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id, col.id)}
                      className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-grab active:cursor-grabbing hover:border-indigo-300 hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded font-medium",
                          task.priority === 'High' ? 'bg-red-50 text-red-600' : task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                        )}>
                          {task.priority}
                        </span>
                        <GripVertical size={14} className="text-gray-300 opacity-0 group-hover:opacity-100" />
                      </div>
                      <p className="text-sm text-gray-800 font-medium mb-3">{task.content}</p>
                      <div className="flex items-center justify-between">
                        {task.assignee ? (
                          <img src={task.assignee} className="w-6 h-6 rounded-full" alt="Assignee" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-100 border border-dashed border-gray-300"></div>
                        )}
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={12} /> 2d
                        </div>
                      </div>
                    </div>
                  ))}
                  {col.tasks.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                      Drop tasks here
                    </div>
                  )}
                </div>

                {/* Add Task Footer */}
                <div className="p-3 pt-0">
                  <button className="w-full py-2 flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-200/50 hover:text-gray-700 rounded-lg text-sm transition-colors border border-transparent hover:border-gray-200 border-dashed">
                    <Plus size={16} /> Add Task
                  </button>
                </div>
              </div>
            ))}

            {/* Add Column Section */}
            <div className="w-80 shrink-0">
              {!isAddingColumn ? (
                <button
                  onClick={() => setIsAddingColumn(true)}
                  className="w-full py-3 flex items-center justify-center gap-2 text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-800 rounded-xl border-2 border-dashed border-gray-200 transition-colors"
                >
                  <Plus size={20} /> Add Status
                </button>
              ) : (
                <div className="bg-white p-3 rounded-xl border border-indigo-200 shadow-lg ring-4 ring-indigo-50/50">
                  <input
                    autoFocus
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Column Title (e.g. Review)"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
                  />
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={handleAddColumn}>Add</Button>
                    <button onClick={() => setIsAddingColumn(false)} className="p-2 hover:bg-gray-100 rounded text-gray-500"><X size={16} /></button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects {country !== 'Global' && `(${country})`}</h1>
          <p className="text-sm text-gray-500">Manage ongoing campaigns and initiatives.</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
          <button className="p-2 bg-indigo-50 text-indigo-600 rounded-md"><Layout size={20} /></button>
          <button className="p-2 hover:bg-gray-50 text-gray-400 rounded-md"><List size={20} /></button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Create New Placeholder */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="group flex flex-col items-center justify-center h-64 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all"
        >
          <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-indigo-600 group-hover:scale-110 transition-all duration-300">
            <Plus size={24} />
          </div>
          <span className="mt-4 font-medium text-gray-900">New Project</span>
          <span className="text-sm text-gray-500">Create a new workspace</span>
        </button>

        {projects.map((project) => (
          <div key={project.id} className="group relative flex flex-col justify-between rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-300 cursor-pointer" onClick={() => setSelectedProject(project)}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider",
                  project.status === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                    project.status === 'Planning' ? 'bg-amber-50 text-amber-700' :
                      'bg-blue-50 text-blue-700'
                )}>
                  {project.status}
                </div>
                <button
                  onClick={(e) => handleEditClick(project, e)}
                  className="text-gray-400 hover:text-indigo-600 p-1 rounded hover:bg-indigo-50 transition-colors"
                >
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{project.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-6 h-10">{project.description}</p>

              <div className="space-y-3">
                <div className="flex justify-between text-xs font-medium text-gray-500">
                  <span>Progress</span>
                  <span className="font-bold text-indigo-600">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden shadow-inner ring-1 ring-gray-200/50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-[0_0_10px_rgba(79,70,229,0.4)] transition-all duration-1000 ease-out"
                    style={{ width: `${project.progress}%` }}
                  >
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 rounded-b-xl flex items-center justify-between">
              <div className="flex -space-x-2">
                {project.members.slice(0, 3).map((m, i) => (
                  <img key={i} src={m} alt="" className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-gray-100" />
                ))}
                {project.members.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                    +{project.members.length - 3}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar size={12} /> {new Date(project.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
                <button
                  className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Project">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Q4 Marketing Sprint"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none h-24 resize-none"
              placeholder="Briefly describe the goals..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateProject} disabled={!newName}>Create Project</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Progress Modal */}
      <Modal isOpen={!!editingProject} onClose={() => setEditingProject(null)} title="Update Project">
        {editingProject && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">{editingProject.name}</h3>
              <p className="text-sm text-gray-500">{editingProject.description}</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Project Progress</label>
                <span className="text-sm font-bold text-indigo-600">{editProgress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={editProgress}
                onChange={(e) => setEditProgress(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Planning</span>
                <span>Active</span>
                <span>Completed</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button variant="secondary" onClick={() => setEditingProject(null)}>Cancel</Button>
              <Button onClick={handleUpdateProgress}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};