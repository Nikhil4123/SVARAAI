import { Request, Response } from 'express';
import User, { IUser } from '../models/User';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, 'name email');
    
    res.json({
      users
    });
    return;
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id, 'name email');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
    return;
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};