import { Request, Response } from 'express';
import { createTask, getTasksByProject, updateTask, deleteTask } from '../controllers/task.controller';
import Task from '../models/Task';
import Project from '../models/Project';

// Mock the Task and Project models
jest.mock('../models/Task');
jest.mock('../models/Project');

describe('Task Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockSend: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockSend = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    
    mockRequest = {};
    mockResponse = {
      json: mockJson,
      status: mockStatus,
      send: mockSend,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a new task successfully', async () => {
      const mockProject = { _id: 'project123' };
      const mockTaskData = {
        _id: 'task123',
        title: 'Test Task',
        description: '',
        status: 'todo',
        priority: 'medium',
        deadline: new Date(),
        projectId: 'project123',
        assignee: null,
      };
      
      const mockTask = {
        ...mockTaskData,
        save: jest.fn().mockResolvedValue(mockTaskData),
        populate: jest.fn().mockReturnThis(),
      };

      (Project.findById as jest.Mock).mockResolvedValue(mockProject);
      (Task as unknown as jest.Mock).mockImplementation(() => mockTask);
      mockTask.populate.mockResolvedValue(mockTaskData);

      // Set deadline to future date
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      
      mockRequest = {
        body: {
          title: 'Test Task',
          description: '',
          status: 'todo',
          priority: 'medium',
          deadline: futureDate,
          projectId: 'project123',
          assignee: null,
        },
      };

      await createTask(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(201);
      // Check that json was called with an object containing the expected properties
      expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
        _id: 'task123',
        title: 'Test Task',
        status: 'todo',
        priority: 'medium',
        projectId: 'project123',
      }));
    });

    it('should return 404 if project not found', async () => {
      (Project.findById as jest.Mock).mockResolvedValue(null);

      mockRequest = {
        body: {
          title: 'Test Task',
          status: 'todo',
          priority: 'medium',
          deadline: new Date(),
          projectId: 'nonexistent',
        },
      };

      await createTask(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Project not found' });
    });

    it('should return 400 if deadline is in the past', async () => {
      const mockProject = { _id: 'project123' };
      (Project.findById as jest.Mock).mockResolvedValue(mockProject);

      // Set deadline to past date
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 7);
      
      mockRequest = {
        body: {
          title: 'Test Task',
          status: 'todo',
          priority: 'medium',
          deadline: pastDate,
          projectId: 'project123',
        },
      };

      await createTask(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Deadline must be in the future' });
    });

    it('should return 500 if there is a server error', async () => {
      (Project.findById as jest.Mock).mockRejectedValue(new Error('Database error'));

      mockRequest = {
        body: {
          title: 'Test Task',
          status: 'todo',
          priority: 'medium',
          deadline: new Date(),
          projectId: 'project123',
        },
      };

      await createTask(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Server error',
        error: 'Database error',
      });
    });
  });

  describe('getTasksByProject', () => {
    it('should fetch tasks by project successfully', async () => {
      const mockTasks = [
        {
          _id: 'task1',
          title: 'Task 1',
          description: '',
          status: 'todo',
          priority: 'high',
          deadline: new Date(),
          projectId: 'project123',
          assignee: null,
        },
        {
          _id: 'task2',
          title: 'Task 2',
          description: '',
          status: 'in-progress',
          priority: 'medium',
          deadline: new Date(),
          projectId: 'project123',
          assignee: null,
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
        params: { projectId: 'project123' },
        query: {},
      };

      await getTasksByProject(mockRequest as Request, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith({
        tasks: mockTasks,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalTasks: 2,
        },
      });
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const mockUpdatedTask = {
        _id: 'task123',
        title: 'Updated Task',
        description: '',
        status: 'in-progress',
        priority: 'high',
        deadline: new Date(Date.now() + 86400000), // Tomorrow
        projectId: 'project123',
        assignee: null,
      };
      
      const mockTask = {
        ...mockUpdatedTask,
        populate: jest.fn().mockReturnThis(),
      };

      (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockTask);
      mockTask.populate.mockResolvedValue(mockUpdatedTask);

      mockRequest = {
        params: { id: 'task123' },
        body: {
          title: 'Updated Task',
          description: '',
          status: 'in-progress',
          priority: 'high',
          deadline: new Date(Date.now() + 86400000), // Tomorrow
          projectId: 'project123',
        },
      };

      await updateTask(mockRequest as Request, mockResponse as Response);

      // Check that json was called with an object containing the expected properties
      expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
        _id: 'task123',
        title: 'Updated Task',
        status: 'in-progress',
        priority: 'high',
        projectId: 'project123',
      }));
    });

    it('should return 404 if task not found', async () => {
      (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      mockRequest = {
        params: { id: 'nonexistent' },
        body: {
          title: 'Updated Task',
          status: 'in-progress',
        },
      };

      await updateTask(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Task not found' });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      (Task.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: 'task123' });

      mockRequest = {
        params: { id: 'task123' },
      };

      await deleteTask(mockRequest as Request, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith({ message: 'Task deleted successfully' });
    });

    it('should return 404 if task not found', async () => {
      (Task.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      mockRequest = {
        params: { id: 'nonexistent' },
      };

      await deleteTask(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Task not found' });
    });
  });
});