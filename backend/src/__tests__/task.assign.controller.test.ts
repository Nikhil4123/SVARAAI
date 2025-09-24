import { Request, Response } from 'express';
import { assignTask, getTasksByAssignee } from '../controllers/task.controller';
import Task from '../models/Task';
import User from '../models/User';

// Mock the Task and User models
jest.mock('../models/Task');
jest.mock('../models/User');

describe('Task Assignment Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    
    mockRequest = {};
    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('assignTask', () => {
    it('should assign a task to a user successfully', async () => {
      const mockUser = { _id: 'user123', name: 'John Doe', email: 'john@example.com' };
      const mockTaskData = {
        _id: 'task123',
        title: 'Test Task',
        description: '',
        status: 'todo',
        priority: 'medium',
        deadline: new Date(),
        projectId: 'project123',
        assignee: 'user123',
      };
      
      const mockTask = {
        ...mockTaskData,
        populate: jest.fn().mockReturnThis(),
      };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockTask);
      mockTask.populate.mockResolvedValue(mockTaskData);

      mockRequest = {
        params: { id: 'task123' },
        body: { assignee: 'user123' },
      };

      await assignTask(mockRequest as Request, mockResponse as Response);

      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
        'task123',
        { assignee: 'user123' },
        { new: true, runValidators: true }
      );
      // Check that json was called with an object containing the expected properties
      expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
        _id: 'task123',
        title: 'Test Task',
        status: 'todo',
        priority: 'medium',
        projectId: 'project123',
        assignee: 'user123',
      }));
    });

    it('should return 404 if assignee not found', async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      mockRequest = {
        params: { id: 'task123' },
        body: { assignee: 'nonexistent' },
      };

      await assignTask(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Assignee not found' });
    });

    it('should return 404 if task not found', async () => {
      const mockUser = { _id: 'user123', name: 'John Doe' };
      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      mockRequest = {
        params: { id: 'nonexistent' },
        body: { assignee: 'user123' },
      };

      await assignTask(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Task not found' });
    });

    it('should return 500 if there is a server error', async () => {
      (User.findById as jest.Mock).mockRejectedValue(new Error('Database error'));

      mockRequest = {
        params: { id: 'task123' },
        body: { assignee: 'user123' },
      };

      await assignTask(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Server error',
        error: 'Database error',
      });
    });
  });

  describe('getTasksByAssignee', () => {
    it('should fetch tasks by assignee successfully', async () => {
      const mockTasks = [
        {
          _id: 'task1',
          title: 'Task 1',
          description: '',
          status: 'todo',
          priority: 'high',
          deadline: new Date(),
          projectId: 'project123',
          assignee: 'user123',
        },
        {
          _id: 'task2',
          title: 'Task 2',
          description: '',
          status: 'in-progress',
          priority: 'medium',
          deadline: new Date(),
          projectId: 'project123',
          assignee: 'user123',
        },
      ];

      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockTasks),
      };

      (Task.find as jest.Mock).mockReturnValue(mockFind);
      (Task.countDocuments as jest.Mock).mockResolvedValue(2);

      mockRequest = {
        params: { assigneeId: 'user123' },
        query: {},
      };

      await getTasksByAssignee(mockRequest as Request, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith({
        tasks: mockTasks,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalTasks: 2,
        },
      });
    });

    it('should return 500 if there is a server error', async () => {
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockRejectedValue(new Error('Database error')),
      };

      (Task.find as jest.Mock).mockReturnValue(mockFind);

      mockRequest = {
        params: { assigneeId: 'user123' },
        query: {},
      };

      await getTasksByAssignee(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Server error',
        error: 'Database error',
      });
    });
  });
});