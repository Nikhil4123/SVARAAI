import React from 'react';
import { Button } from './Button';

interface Task {
  _id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  projectId: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: 'todo' | 'in-progress' | 'done') => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onUpdateStatus,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusActions = () => {
    switch (task.status) {
      case 'todo':
        return (
          <button
            onClick={() => onUpdateStatus(task._id, 'in-progress')}
            className="text-xs text-indigo-600 hover:text-indigo-900"
          >
            Start
          </button>
        );
      case 'in-progress':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => onUpdateStatus(task._id, 'todo')}
              className="text-xs text-gray-600 hover:text-gray-900"
            >
              Back to To Do
            </button>
            <button
              onClick={() => onUpdateStatus(task._id, 'done')}
              className="text-xs text-green-600 hover:text-green-900"
            >
              Complete
            </button>
          </div>
        );
      case 'done':
        return (
          <button
            onClick={() => onUpdateStatus(task._id, 'in-progress')}
            className="text-xs text-gray-600 hover:text-gray-900"
          >
            Reopen
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <div className="flex justify-between">
        <h5 className="font-medium text-gray-900">{task.title}</h5>
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(task)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            onClick={() => onDelete(task._id)}
            className="text-gray-500 hover:text-red-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <span className="text-xs text-gray-500">
          Due: {new Date(task.deadline).toLocaleDateString()}
        </span>
      </div>
      <div className="mt-3 flex">
        {getStatusActions()}
      </div>
    </div>
  );
};