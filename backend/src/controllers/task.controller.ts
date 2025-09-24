import { Request, Response } from 'express';
import Task, { ITask } from '../models/Task';
import Project from '../models/Project';
import User from '../models/User';

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status, priority, deadline, projectId, assignee } = req.body;
    
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if assignee exists (if provided)
    if (assignee) {
      const user = await User.findById(assignee);
      if (!user) {
        return res.status(404).json({ message: 'Assignee not found' });
      }
    }
    
    // Validate deadline
    if (new Date(deadline) < new Date()) {
      return res.status(400).json({ message: 'Deadline must be in the future' });
    }
    
    const task = new Task({ 
      title, 
      description: description || '',
      status: status || 'todo', 
      priority: priority || 'medium', 
      deadline, 
      projectId,
      assignee: assignee || null
    });
    await task.save();
    
    // Populate assignee details if assigned
    if (task.assignee) {
      await task.populate('assignee', 'name email');
    }
    
    res.status(201).json(task);
    return;
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getTasksByProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { status, priority, assignee, startDate, endDate, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter: any = { projectId };
    
    if (status) {
      filter.status = status;
    }
    
    if (priority) {
      filter.priority = priority;
    }
    
    if (assignee) {
      filter.assignee = assignee;
    }
    
    if (startDate || endDate) {
      filter.deadline = {};
      if (startDate) {
        filter.deadline.$gte = new Date(startDate as string);
      }
      if (endDate) {
        filter.deadline.$lte = new Date(endDate as string);
      }
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const tasks = await Task.find(filter)
      .populate('assignee', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
      
    const total = await Task.countDocuments(filter);
    
    res.json({
      tasks,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalTasks: total
      }
    });
    return;
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, deadline, projectId, assignee } = req.body;
    
    // Check if assignee exists (if provided)
    if (assignee) {
      const user = await User.findById(assignee);
      if (!user) {
        return res.status(404).json({ message: 'Assignee not found' });
      }
    }
    
    // Validate deadline if provided
    if (deadline && new Date(deadline) < new Date()) {
      return res.status(400).json({ message: 'Deadline must be in the future' });
    }
    
    const task = await Task.findByIdAndUpdate(
      id,
      { title, description, status, priority, deadline, projectId, assignee },
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Populate assignee details
    await task.populate('assignee', 'name email');
    
    res.json(task);
    return;
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findByIdAndDelete(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
    return;
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const assignTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { assignee } = req.body;
    
    // Check if assignee exists
    const user = await User.findById(assignee);
    if (!user) {
      return res.status(404).json({ message: 'Assignee not found' });
    }
    
    const task = await Task.findByIdAndUpdate(
      id,
      { assignee },
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Populate assignee details
    await task.populate('assignee', 'name email');
    
    res.json(task);
    return;
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getTasksByAssignee = async (req: Request, res: Response) => {
  try {
    const { assigneeId } = req.params;
    const { status, priority, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter: any = { assignee: assigneeId };
    
    if (status) {
      filter.status = status;
    }
    
    if (priority) {
      filter.priority = priority;
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const tasks = await Task.find(filter)
      .populate('projectId', 'name')
      .populate('assignee', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
      
    const total = await Task.countDocuments(filter);
    
    res.json({
      tasks,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalTasks: total
      }
    });
    return;
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};