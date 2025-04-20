import React, { useState } from 'react';
import { PlusCircle, ListTodo } from 'lucide-react';
import { cn } from '../utils/cn';
import CreateTask from './CreateTask';
import TaskList from './TaskList';

const TaskTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('create')}
            className={cn(
              "py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center w-1/2 transition-colors",
              activeTab === 'create'
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Create Task
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={cn(
              "py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center w-1/2 transition-colors",
              activeTab === 'list'
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            <ListTodo className="h-5 w-5 mr-2" />
            Task List
          </button>
        </nav>
      </div>
      
      <div className="p-6">
        {activeTab === 'create' ? <CreateTask /> : <TaskList />}
      </div>
    </div>
  );
};

export default TaskTabs;