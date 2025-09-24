import { Request, Response } from 'express';
import Project, { IProject } from '../models/Project';

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    
    const project = new Project({ name, description });
    await project.save();
    
    res.status(201).json(project);
    return;
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
    return;
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
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