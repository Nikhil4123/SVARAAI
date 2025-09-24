import { Request, Response } from 'express';
import Project, { IProject } from '../models/Project';
import Task, { ITask } from '../models/Task';

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, startDate, endDate, status } = req.body;
    
    // Handle empty endDate
    const projectData: any = { 
      name, 
      description,
      startDate: startDate || new Date(),
      status: status || 'planning'
    };
    
    // Only add endDate if it's provided and not empty
    if (endDate) {
      projectData.endDate = endDate;
    }
    
    const project = new Project(projectData);
    await project.save();
    
    res.status(201).json(project);
    return;
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
      
    const total = await Project.countDocuments(filter);
    
    res.json({
      projects,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalProjects: total
      }
    });
    return;
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, startDate, endDate, status } = req.body;
    
    const project = await Project.findByIdAndUpdate(
      id,
      { name, description, startDate, endDate, status },
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
    return;
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // First delete all tasks associated with this project
    await Task.deleteMany({ projectId: id });
    
    const project = await Project.findByIdAndDelete(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted successfully' });
    return;
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};