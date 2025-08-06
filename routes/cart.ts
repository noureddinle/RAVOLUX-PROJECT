import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { handleError } from '../lib/errorHandler';
import { CartInsert, CartItemInsert } from '@/types/supabase';

const router = Router();

// Get or create cart
router.post('/', async (req: Request, res: Response) => {
  try {
    const { user_id, session_id } = req.body as CartInsert;
    const { data, error } = await supabase
      .rpc('get_or_create_cart', { p_user_id: user_id, p_session_id: session_id });

    if (error) throw error;
    res.json({ cart_id: data });
  } catch (error) {
    handleError(res, error, 'Failed to get or create cart');
  }
});

// Get cart with items
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('carts')
      .select(`*, items:cart_items(*, product:products(*))`)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Cart not found' });
    res.json(data);
  } catch (error) {
    handleError(res, error, 'Failed to fetch cart');
  }
});

// Add item to cart
router.post('/:id/items', async (req: Request, res: Response) => {
  try {
    const cartId = req.params.id;
    const { product_id, quantity, price_at_time } = req.body as CartItemInsert;
    const { data, error } = await supabase
      .from('cart_items')
      .insert({ cart_id: cartId, product_id, quantity, price_at_time })
      .select(`*, product:products(*)`)
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    handleError(res, error, 'Failed to add item to cart');
  }
});

// Update cart item
router.put('/items/:id', async (req: Request, res: Response) => {
  try {
    const { quantity } = req.body as CartItemInsert;
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', req.params.id)
      .select(`*, product:products(*)`)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Cart item not found' });
    res.json(data);
  } catch (error) {
    handleError(res, error, 'Failed to update cart item');
  }
});

// Remove item from cart
router.delete('/items/:id', async (req: Request, res: Response) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    handleError(res, error, 'Failed to remove cart item');
  }
});

export default router;