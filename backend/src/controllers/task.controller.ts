import { Request, Response } from 'express';
import Task, { ITask } from '../models/Task';
import Project from '../models/Project';

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, status, priority, deadline, projectId } = req.body;
    
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const task = new Task({ title, status, priority, deadline, projectId });
    await task.save();
    
    res.status(201).json(task);
    return;
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getTasksByProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { status, priority, startDate, endDate, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter: any = { projectId };
    
    if (status) {
      filter.status = status;
    }
    
    if (priority) {
      filter.priority = priority;
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
    const { title, status, priority, deadline, projectId } = req.body;
    
    const task = await Task.findByIdAndUpdate(
      id,
      { title, status, priority, deadline, projectId },
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
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