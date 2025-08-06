import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { handleError } from '../lib/errorHandler';
import { requireAdmin } from '../lib/middleware';

const router = Router();

router.get('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    handleError(res, error, 'Failed to fetch users');
  }
});

export default router;
