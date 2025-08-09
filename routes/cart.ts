import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { handleError } from '../lib/errorHandler';
import { CartInsert, CartItemInsert } from '@/types/supabase';

const router = Router();

// Get or create cart
router.post('/', async (req: Request, res: Response) => {
  try {
    const { user_id, session_id } = req.body as CartInsert;
    
    // First, try to find an existing cart
    let query = supabase.from('carts').select('id');
    
    if (user_id) {
      query = query.eq('user_id', user_id);
    } else if (session_id) {
      query = query.eq('session_id', session_id);
    } else {
      return res.status(400).json({ error: 'Either user_id or session_id is required' });
    }
    
    const { data: existingCart, error: findError } = await query.single();
    
    if (findError && findError.code !== 'PGRST116') {
      throw findError;
    }
    
    if (existingCart) {
      return res.json({ cart_id: existingCart.id });
    }
    
    // Create new cart if none exists
    const { data: newCart, error: createError } = await supabase
      .from('carts')
      .insert({ user_id, session_id })
      .select('id')
      .single();
    
    if (createError) throw createError;
    
    res.json({ cart_id: newCart.id });
  } catch (error) {
    console.error('Cart creation error:', error);
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
    console.error('Cart fetch error:', error);
    handleError(res, error, 'Failed to fetch cart');
  }
});

// Add item to cart
router.post('/:id/items', async (req: Request, res: Response) => {
  try {
    const cartId = req.params.id;
    const { product_id, quantity, price_at_time } = req.body as CartItemInsert;
    
    // Check if item already exists in cart
    const { data: existingItem, error: checkError } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cartId)
      .eq('product_id', product_id)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    if (existingItem) {
      // Update quantity if item exists
      const { data: updatedItem, error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)
        .select(`*, product:products(*)`)
        .single();
      
      if (updateError) throw updateError;
      return res.json(updatedItem);
    }
    
    // Add new item
    const { data, error } = await supabase
      .from('cart_items')
      .insert({ cart_id: cartId, product_id, quantity, price_at_time })
      .select(`*, product:products(*)`)
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Add to cart error:', error);
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
    console.error('Update cart item error:', error);
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
    console.error('Remove cart item error:', error);
    handleError(res, error, 'Failed to remove cart item');
  }
});

export default router;