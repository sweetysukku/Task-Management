import React, { useState } from 'react';
import { Check, Trash, Edit, X, Save } from 'lucide-react';
import { cn } from '../utils/cn';
import { useTask } from '../contexts/TaskContext';
import { Task } from '../types';
import toast from 'react-hot-toast';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleComplete, updateTask, deleteTask } = useTask();
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editPriority, setEditPriority] = useState(task.priority);

  const handleToggleComplete = () => {
    toggleComplete(task.id);
    toast.success(task.completed ? 'Task marked as incomplete' : 'Task completed!');
  };

  const handleDelete = () => {
    deleteTask(task.id);
    toast.success('Task deleted');
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditPriority(task.priority);
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim()) {
      toast.error('Task title cannot be empty');
      return;
    }

    updateTask({
      ...task,
      title: editTitle,
      description: editDescription,
      priority: editPriority as Task['priority'],
    });
    
    setEditing(false);
    toast.success('Task updated');
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <li 
      className={cn(
        "border rounded-lg overflow-hidden shadow-sm transition-all duration-200 transform hover:shadow-md hover:translate-y-[-2px]",
        task.completed ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200"
      )}
    >
      <div className="p-4">
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as Task['priority'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="flex space-x-2 pt-2">
              <button
                onClick={handleSaveEdit}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start">
              <div className="flex-grow">
                <div className="flex items-center">
                  <h3 
                    className={cn(
                      "text-lg font-medium",
                      task.completed ? "text-gray-500 line-through" : "text-gray-900"
                    )}
                  >
                    {task.title}
                  </h3>
                  <span 
                    className={cn(
                      "ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium",
                      getPriorityColor(task.priority)
                    )}
                  >
                    {task.priority}
                  </span>
                </div>
                
                {task.description && (
                  <p 
                    className={cn(
                      "mt-1 text-sm",
                      task.completed ? "text-gray-400 line-through" : "text-gray-600"
                    )}
                  >
                    {task.description}
                  </p>
                )}
                
                <div className="mt-2 text-xs text-gray-500">
                  Created: {new Date(task.createdAt).toLocaleString()}
                </div>
              </div>
              
              <div className="flex-shrink-0 ml-4 space-x-1">
                <button
                  onClick={handleToggleComplete}
                  className={cn(
                    "inline-flex items-center justify-center p-2 rounded-full text-white transition-colors",
                    task.completed ? "bg-green-500 hover:bg-green-600" : "bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-700"
                  )}
                  aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </li>
  );
};

export default TaskItem;