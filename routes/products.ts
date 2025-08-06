import { ProductInsert, ProductUpdate, Product } from "@/types/supabase";
import { Request, Response, Router } from 'express';
import { supabase } from '../lib/supabase';
import { handleError } from '../lib/errorHandler';

const router = Router();

// Get all products with optional filtering and pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    let query = supabase
      .from('products')
      .select(`*`)
      .order('created_at', { ascending: false });

    // Only filter by category if it's provided
    if (req.query.category) {
      query = query.eq('category', req.query.category);
    }

    const { data, error } = await query;
    
    if (error) throw error;

    // Return response in the format expected by frontend
    res.json({
      success: true,
      data: data || [],
      message: 'Products fetched successfully'
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      data: [],
      message: error instanceof Error ? error.message : 'Failed to fetch products'
    });
  }
});

// Get single product by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`*`)
      .eq('id', req.params.id)
      .single<Product>();

    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: data,
      message: 'Product fetched successfully'
    });
    
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Failed to fetch product'
    });
  }
});

// Create new product
router.post('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(req.body as ProductInsert)
      .select()
      .single<Product>();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: data,
      message: 'Product created successfully'
    });
    
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Failed to create product'
    });
  }
});

// Update product
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(req.body as ProductUpdate)
      .eq('id', req.params.id)
      .select()
      .single<Product>();

    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: data,
      message: 'Product updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Failed to update product'
    });
  }
});

// Delete product
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: null,
      message: 'Product deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Failed to delete product'
    });
  }
});

export default router;