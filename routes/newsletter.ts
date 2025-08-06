import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { handleError } from '../lib/errorHandler';
import { NewsletterSubscription, NewsletterSubscriptionInsert, ApiResponse } from '../types/supabase';

const router = Router();

// POST: Subscribe to newsletter
router.post('/', async (req: Request, res: Response) => {
  try {
    const { email } = req.body as NewsletterSubscriptionInsert;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw Object.assign(new Error(), {
        error: 'Invalid Input',
        message: 'A valid email is required',
        statusCode: 400,
      });
    }

    const subscription: NewsletterSubscriptionInsert = {
      email,
      is_active: true,
    };

    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .insert(subscription)
      .select()
      .single<NewsletterSubscription>();

    if (error) throw error;

    res.status(201).json({
      data,
      message: 'Successfully subscribed to newsletter',
      success: true,
    } as ApiResponse<NewsletterSubscription>);
  } catch (error) {
    handleError(res, error, 'Failed to add to newsletter');
  }
});

// GET: Fetch all subscriptions or filter by email
router.get('/', async (req: Request, res: Response) => {
  try {
    const { email } = req.query;
    let query = supabase.from('newsletter_subscriptions').select('*');

    if (email && typeof email === 'string') {
      query = query.eq('email', email);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      data: data || [],
      message: 'Successfully fetched subscriptions',
      success: true,
    } as ApiResponse<NewsletterSubscription[]>);
  } catch (error) {
    handleError(res, error, 'Failed to fetch newsletter subscriptions');
  }
});

// GET: Fetch a single subscription by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .eq('id', req.params.id)
      .single<NewsletterSubscription>();

    if (error?.code === 'PGRST116') {
      throw Object.assign(new Error(), {
        error: 'Not Found',
        message: 'Subscription not found',
        statusCode: 404,
      });
    }
    if (error) throw error;

    res.json({
      data,
      message: 'Successfully fetched subscription',
      success: true,
    } as ApiResponse<NewsletterSubscription>);
  } catch (error) {
    handleError(res, error, 'Failed to fetch newsletter subscription');
  }
});

// PATCH: Update subscription (e.g., toggle is_active)
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { is_active } = req.body as Partial<NewsletterSubscription>;
    if (is_active === undefined) {
      throw Object.assign(new Error(), {
        error: 'Invalid Input',
        message: 'is_active field is required',
        statusCode: 400,
      });
    }

    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .update({ is_active, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single<NewsletterSubscription>();

    if (error?.code === 'PGRST116') {
      throw Object.assign(new Error(), {
        error: 'Not Found',
        message: 'Subscription not found',
        statusCode: 404,
      });
    }
    if (error) throw error;

    res.json({
      data,
      message: 'Successfully updated subscription',
      success: true,
    } as ApiResponse<NewsletterSubscription>);
  } catch (error) {
    handleError(res, error, 'Failed to update newsletter subscription');
  }
});

// DELETE: Unsubscribe by ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single<NewsletterSubscription>();

    if (error?.code === 'PGRST116') {
      throw Object.assign(new Error(), {
        error: 'Not Found',
        message: 'Subscription not found',
        statusCode: 404,
      });
    }
    if (error) throw error;

    res.status(200).json({
      data,
      message: 'Successfully unsubscribed',
      success: true,
    } as ApiResponse<NewsletterSubscription>);
  } catch (error) {
    handleError(res, error, 'Failed to delete newsletter subscription');
  }
});

export default router;