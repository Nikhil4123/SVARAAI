import { Request, Response } from 'express';
import { getAllUsers, getUserById } from '../controllers/user.controller';
import User from '../models/User';

// Mock the User model
jest.mock('../models/User');

describe('User Controller', () => {
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

  describe('getAllUsers', () => {
    it('should fetch all users successfully', async () => {
      const mockUsers = [
        {
          _id: 'user1',
          name: 'John Doe',
          email: 'john@example.com',
        },
        {
          _id: 'user2',
          name: 'Jane Smith',
          email: 'jane@example.com',
        },
      ];

      (User.find as jest.Mock).mockResolvedValue(mockUsers);

      await getAllUsers(mockRequest as Request, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith({
        users: mockUsers,
      });
    });

    it('should return 500 if there is a server error', async () => {
      (User.find as jest.Mock).mockRejectedValue(new Error('Database error'));

      await getAllUsers(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Server error',
        error: 'Database error',
      });
    });
  });

  describe('getUserById', () => {
    it('should fetch a user by ID successfully', async () => {
      const mockUser = {
        _id: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
      };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      mockRequest = {
        params: { id: 'user123' },
      };

      await getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockJson).toHaveBeenCalledWith(mockUser);
    });

    it('should return 404 if user not found', async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      mockRequest = {
        params: { id: 'nonexistent' },
      };

      await getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 500 if there is a server error', async () => {
      (User.findById as jest.Mock).mockRejectedValue(new Error('Database error'));

      mockRequest = {
        params: { id: 'user123' },
      };

      await getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Server error',
        error: 'Database error',
      });
    });
  });
});