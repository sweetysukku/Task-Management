import React from 'react';
import Navbar from '../components/Navbar';
import TaskTabs from '../components/TaskTabs';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your tasks efficiently and stay organized
          </p>
        </div>
        
        <TaskTabs />
      </main>
    </div>
  );
};

export default Dashboard;