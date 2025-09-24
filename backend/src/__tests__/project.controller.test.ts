import { Request, Response } from 'express';
import { createProject, getProjects, updateProject, deleteProject } from '../controllers/project.controller';
import Project from '../models/Project';
import Task from '../models/Task';

// Mock the Project and Task models
jest.mock('../models/Project');
jest.mock('../models/Task');

describe('Project Controller', () => {
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

  describe('createProject', () => {
    it('should create a new project successfully', async () => {
      const mockProjectData = {
        _id: 'project123',
        name: 'Test Project',
        description: 'Test Description',
        startDate: expect.any(Date),
        endDate: expect.any(Date),
        status: 'active',
      };

      const mockProject = {
        ...mockProjectData,
        save: jest.fn().mockResolvedValue(mockProjectData),
      };

      (Project as unknown as jest.Mock).mockImplementation(() => mockProject);

      mockRequest = {
        body: {
          name: 'Test Project',
          description: 'Test Description',
          startDate: new Date(),
          endDate: new Date(),
          status: 'active',
        },
      };

      await createProject(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(201);
      // Check that json was called with an object containing the expected properties
      expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
        _id: 'project123',
        name: 'Test Project',
        description: 'Test Description',
        status: 'active',
      }));
    });

    it('should return 500 if there is a server error', async () => {
      (Project as unknown as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      mockRequest = {
        body: {
          name: 'Test Project',
          description: 'Test Description',
        },
      };

      await createProject(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Server error',
        error: 'Database error',
      });
    });
  });

  describe('getProjects', () => {
    it('should fetch projects successfully', async () => {
      const mockProjects = [
        {
          _id: 'project1',
          name: 'Project 1',
          description: 'Description 1',
          startDate: new Date(),
          endDate: new Date(),
          status: 'active',
        },
        {
          _id: 'project2',
          name: 'Project 2',
          description: 'Description 2',
          startDate: new Date(),
          endDate: new Date(),
          status: 'planning',
        },
      ];

      (Project.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue(mockProjects),
          }),
        }),
      });
      
      (Project.countDocuments as jest.Mock).mockResolvedValue(2);

      mockRequest = {
        query: {},
      };

      await getProjects(mockRequest as Request, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith({
        projects: mockProjects,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalProjects: 2,
        },
      });
    });
  });

  describe('updateProject', () => {
    it('should update a project successfully', async () => {
      const mockProject = {
        _id: 'project123',
        name: 'Updated Project',
        description: 'Updated Description',
        startDate: new Date(),
        endDate: new Date(),
        status: 'completed',
      };

      (Project.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockProject);

      mockRequest = {
        params: { id: 'project123' },
        body: {
          name: 'Updated Project',
          description: 'Updated Description',
          startDate: new Date(),
          endDate: new Date(),
          status: 'completed',
        },
      };

      await updateProject(mockRequest as Request, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith(mockProject);
    });

    it('should return 404 if project not found', async () => {
      (Project.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      mockRequest = {
        params: { id: 'nonexistent' },
        body: {
          name: 'Updated Project',
        },
      };

      await updateProject(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Project not found' });
    });
  });

  describe('deleteProject', () => {
    it('should delete a project and its tasks successfully', async () => {
      (Task.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 5 });
      (Project.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: 'project123' });

      mockRequest = {
        params: { id: 'project123' },
      };

      await deleteProject(mockRequest as Request, mockResponse as Response);

      expect(Task.deleteMany).toHaveBeenCalledWith({ projectId: 'project123' });
      expect(mockJson).toHaveBeenCalledWith({ message: 'Project deleted successfully' });
    });

    it('should return 404 if project not found', async () => {
      (Task.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 0 });
      (Project.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      mockRequest = {
        params: { id: 'nonexistent' },
      };

      await deleteProject(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Project not found' });
    });
  });
});