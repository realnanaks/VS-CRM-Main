import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Flag, CheckCircle2, Circle, Trash2, Clock } from 'lucide-react';
import { Task, CountryCode } from '../types';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { retrieveDashboardData, addTask, toggleTask, deleteTask, subscribeToStateChanges } from '../services/data';
import { cn } from '../utils/cn';

interface TasksProps {
  country: CountryCode;
}

export const Tasks: React.FC<TasksProps> = ({ country }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const update = () => setTasks(retrieveDashboardData(country).tasks);
    update();
    return subscribeToStateChanges(update);
  }, [country]);

  // Form State
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  const handleToggleTask = (id: string) => {
    toggleTask(id);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
  };

  const handleAddTask = () => {
    if (!title) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      priority,
      completed: false,
      country: country === 'Global' ? 'US' : country
    };

    addTask(newTask);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDueDate('');
    setPriority('Medium');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-amber-100 text-amber-800';
      case 'Low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Sort tasks: Incomplete first, then by priority (High > Medium > Low), then by date
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) {
      // If completion status is same, sort by date
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return a.completed ? 1 : -1;
  });

  const activeCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks {country !== 'Global' && `(${country})`}</h1>
          <p className="text-sm text-gray-500 mt-1">
            You have {activeCount} active tasks and {completedCount} completed.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={16} className="mr-2" />
          Add Task
        </Button>
      </div>

      <div className="space-y-3">
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              "group flex items-center justify-between rounded-xl p-4 border transition-all duration-200",
              task.completed
                ? 'bg-gray-50 border-gray-100 opacity-75'
                : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-sm'
            )}
          >
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => handleToggleTask(task.id)}
                className={cn(
                  "transition-colors",
                  task.completed ? 'text-indigo-500' : 'text-gray-300 hover:text-indigo-500'
                )}
              >
                {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </button>

              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "font-medium text-gray-900 truncate",
                  task.completed && "line-through text-gray-500"
                )}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="px-1.5 py-0.5 rounded bg-gray-100">{task.country}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                getPriorityColor(task.priority)
              )}>
                {task.priority}
              </span>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="p-2 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all rounded-lg hover:bg-red-50"
                title="Delete task"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
            <div className="mx-auto h-12 w-12 text-gray-300 flex items-center justify-center rounded-full bg-gray-50 mb-3">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
            <p className="text-gray-500 text-sm mt-1">No tasks on your list right now.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Follow up with new leads"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <div className="relative">
                <Flag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none appearance-none bg-white"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 border-t border-gray-100 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTask} disabled={!title}>Create Task</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};