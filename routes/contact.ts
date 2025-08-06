import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { handleError } from '../lib/errorHandler';
import { ContactMessageInsert, ContactMessageUpdate } from '@/types/supabase';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body as ContactMessageInsert;
    const { data, error } = await supabase.from('contact_messages').insert({ name, email, subject, message });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    handleError(res, error, 'Failed to send message');
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('contact_messages').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    handleError(res, error, 'Failed to fetch messages');
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('contact_messages').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    handleError(res, error, 'Failed to fetch message');
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('contact_messages').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    handleError(res, error, 'Failed to delete message');
  }
});

router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('contact_messages').update(req.body as ContactMessageUpdate).eq('id', req.params.id);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    handleError(res, error, 'Failed to update message');
  }
});

export default router;