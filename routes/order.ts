import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { handleError } from '../lib/errorHandler';
import { OrderInsert, OrderItemInsert, OrderUpdate } from '../types/supabase';

const router = Router();

// Get orders for user
router.get('/', async (req: Request, res: Response) => {
  try {
    const { user_id } = req.query;
    let query = supabase
      .from('orders')
      .select(`*, items:order_items(*, product:products(*))`, { count: 'exact' });

    if (user_id) query = query.eq('user_id', user_id);
    query = query
      .order('created_at', { ascending: false });

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ data, count });
  } catch (error) {
    handleError(res, error, 'Failed to fetch orders');
  }
});

// Get single order
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`*, items:order_items(*, product:products(*))`)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Order not found' });
    res.json(data);
  } catch (error) {
    handleError(res, error, 'Failed to fetch order');
  }
});

// Create new order
router.post('/', async (req: Request, res: Response) => {
  try {
    const { items, ...orderData } = req.body as OrderInsert & { items: OrderItemInsert[] };
    // Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    if (items && items.length > 0) {
      const orderItems = items.map((item: OrderItemInsert) => ({ ...item, order_id: order.id }));
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;
    }

    // Fetch complete order with items
    const { data: completeOrder, error: fetchError } = await supabase
      .from('orders')
      .select(`*, items:order_items(*, product:products(*))`)
      .eq('id', order.id)
      .single();

    if (fetchError) throw fetchError;
    res.status(201).json(completeOrder);
  } catch (error) {
    handleError(res, error, 'Failed to create order');
  }
});

// Update order status
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update(req.body as OrderUpdate)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Order not found' });
    res.json(data);
  } catch (error) {
    handleError(res, error, 'Failed to update order');
  }
});

export default router;