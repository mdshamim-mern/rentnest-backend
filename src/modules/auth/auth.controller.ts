import { Request, Response } from 'express';
import { AuthService } from './auth.service';

const signup = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.signup(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.login(req.body);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: result
    });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
};

const getMe = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: (req as any).user
    });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export const AuthController = { signup, login, getMe };