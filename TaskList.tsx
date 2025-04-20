import React, { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { useTask } from '../contexts/TaskContext';
import TaskItem from './TaskItem';
import { Task } from '../types';

const TaskList: React.FC = () => {
  const { tasks, loading } = useTask();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'active'>('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'completed') return matchesSearch && task.completed;
    if (filterStatus === 'active') return matchesSearch && !task.completed;
    
    return matchesSearch;
  });

  // Sort tasks: incomplete first, then by priority (high to low), then by creation date (newest first)
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    // Then sort by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Tasks</h2>
      
      <div className="mb-6 space-y-4">
        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'completed' | 'active')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Tasks</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      
      {/* Task list */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading tasks...</p>
        </div>
      ) : sortedTasks.length > 0 ? (
        <ul className="space-y-4">
          {sortedTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
      ) : (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-600">No tasks found</p>
          {searchTerm || filterStatus !== 'all' ? (
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filter</p>
          ) : (
            <p className="text-sm text-gray-500 mt-1">Create a new task to get started</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskList;