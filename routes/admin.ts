import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { handleError } from '../lib/errorHandler';
import { requireAdmin } from '../lib/middleware';

const router = Router();

// Get all users (customers)
router.get('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    handleError(res, error, 'Failed to fetch users');
  }
});

// Get newsletter subscribers
router.get('/newsletter-subscribers', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .order('subscribed_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    handleError(res, error, 'Failed to fetch newsletter subscribers');
  }
});

// Get dashboard statistics
router.get('/statistics', requireAdmin, async (req: Request, res: Response) => {
  try {
    // Get all orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*, items:order_items(*, product:products(*))');
    
    if (ordersError) throw ordersError;

    // Calculate statistics
    const totalRevenue = orders?.reduce((sum: number, order: any) => sum + (order.total || 0), 0) || 0;
    const totalOrders = orders?.length || 0;
    const completedOrders = orders?.filter((order: any) => order.status === 'delivered').length || 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate top selling products
    const productSales: Record<string, number> = {};
    orders?.forEach((order: any) => {
      if (order.items) {
        order.items.forEach((item: any) => {
          const productName = item.product?.name || 'Unknown Product';
          productSales[productName] = (productSales[productName] || 0) + item.quantity;
        });
      }
    });

    const topSellingProducts = Object.entries(productSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    res.json({
      totalRevenue,
      totalOrders,
      totalCompletedOrders: completedOrders,
      averageOrderValue,
      topSellingProducts,
    });
  } catch (error) {
    handleError(res, error, 'Failed to fetch dashboard statistics');
  }
});

export default router;
