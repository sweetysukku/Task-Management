import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Task, TaskState, TaskAction } from '../types';

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.payload,
        loading: false,
        error: null,
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        loading: false,
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        ),
        loading: false,
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        loading: false,
      };
    case 'TOGGLE_COMPLETE':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload 
            ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() } 
            : task
        ),
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { user } = useAuth();

  const getTaskKey = () => {
    return user ? `tasks_${user.id}` : null;
  };

  const fetchTasks = () => {
    const taskKey = getTaskKey();
    if (!taskKey) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const tasks = JSON.parse(localStorage.getItem(taskKey) || '[]');
      dispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch tasks' });
    }
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const taskKey = getTaskKey();
    if (!taskKey) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const now = new Date().toISOString();
      const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };

      const tasks = JSON.parse(localStorage.getItem(taskKey) || '[]');
      const updatedTasks = [...tasks, newTask];
      localStorage.setItem(taskKey, JSON.stringify(updatedTasks));
      
      dispatch({ type: 'ADD_TASK', payload: newTask });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add task' });
    }
  };

  const updateTask = (task: Task) => {
    const taskKey = getTaskKey();
    if (!taskKey) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const tasks = JSON.parse(localStorage.getItem(taskKey) || '[]');
      const updatedTask = { ...task, updatedAt: new Date().toISOString() };
      const updatedTasks = tasks.map((t: Task) => 
        t.id === task.id ? updatedTask : t
      );
      
      localStorage.setItem(taskKey, JSON.stringify(updatedTasks));
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update task' });
    }
  };

  const deleteTask = (id: string) => {
    const taskKey = getTaskKey();
    if (!taskKey) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const tasks = JSON.parse(localStorage.getItem(taskKey) || '[]');
      const updatedTasks = tasks.filter((t: Task) => t.id !== id);
      
      localStorage.setItem(taskKey, JSON.stringify(updatedTasks));
      dispatch({ type: 'DELETE_TASK', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete task' });
    }
  };

  const toggleComplete = (id: string) => {
    const taskKey = getTaskKey();
    if (!taskKey) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const tasks = JSON.parse(localStorage.getItem(taskKey) || '[]');
      const updatedTasks = tasks.map((t: Task) => 
        t.id === id 
          ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() } 
          : t
      );
      
      localStorage.setItem(taskKey, JSON.stringify(updatedTasks));
      dispatch({ type: 'TOGGLE_COMPLETE', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update task' });
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      dispatch({ type: 'SET_TASKS', payload: [] });
    }
  }, [user]);

  return (
    <TaskContext.Provider 
      value={{ 
        ...state, 
        fetchTasks, 
        addTask, 
        updateTask, 
        deleteTask, 
        toggleComplete 
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};