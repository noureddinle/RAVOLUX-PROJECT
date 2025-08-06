import { Router, Request, Response as ExpressResponse } from 'express';
import bcrypt from 'bcrypt';
import { supabase } from '../lib/supabase';
import { handleError } from '../lib/errorHandler';
import { UserInsert } from '../types/supabase';
import jwt from 'jsonwebtoken';

const router = Router();

// Register a new user
router.post('/register', async (req: Request, res: ExpressResponse) => {
  try {
    const {
      email,
      password,
      full_name,
      phone,
      role = 'customer',
      email_notifications = true,
      marketing_emails = false
    }: UserInsert & { password: string } = req.body;

    // Validate required fields
    if (!email || !password) {
      return handleError(res, new Error('Email and password are required'), 'Email and password are required');
    }

    // Check if email already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116: No rows found
      return handleError(res, checkError, 'Failed to check if email exists');
    }

    if (existingProfile) {
      return handleError(res, new Error('Email already registered'), 'Email already registered');
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert profile into profiles table with password
    const UserInsert: UserInsert & { password: string } = {
      email,
      password: hashedPassword, 
      full_name,
      phone,
      role,
      email_notifications,
      marketing_emails
    };

    const { data: user, error: userError } = await supabase
      .from('users')
      .insert(UserInsert)
      .select('id, email, role, full_name')
      .single();

    if (userError) return handleError(res, userError, 'Failed to register user');

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '1h' });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        accessToken: token
      }
    });
  } catch (error: any) {
    handleError(res, error, 'Failed to register user');
  }
});

// Login a user
router.post('/login', async (req: Request, res: ExpressResponse) => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    // Validate required fields
    if (!email || !password) {
      return handleError(res, new Error('Email and password are required'), 'Email and password are required');
    }

    // Fetch user profile by email
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password, role, full_name')
      .eq('email', email)
      .single();

    if (error || !user) {
      return handleError(res, error, 'Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return handleError(res, error, 'Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '1h' });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        accessToken: token
      }
    });
  } catch (error: any) {
    handleError(res, error, 'Failed to login user');
  }
});

export default router;