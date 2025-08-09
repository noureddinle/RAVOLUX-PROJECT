import { supabase } from './supabase';
import { UserForm, Order, Product, OrderItem, OrderItemInsert, OrderItemUpdate, OrderItemDelete, NewsletterSubscription } from '@/types/supabase';

// Dashboard Statistics
export async function getDashboardStatistics() {
  try {
    console.log('Fetching dashboard statistics...');
    
    // Get all orders with items and products
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        )
      `);

    if (ordersError) {
      console.error('Supabase error:', ordersError);
      throw ordersError;
    }

    console.log('Orders fetched:', orders?.length || 0);

    // Calculate statistics
    const totalRevenue = orders?.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0) || 0;
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

    return {
      totalRevenue,
      totalOrders,
      totalCompletedOrders: completedOrders,
      averageOrderValue,
      topSellingProducts,
    };
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalCompletedOrders: 0,
      averageOrderValue: 0,
      topSellingProducts: [],
    };
  }
}

// Get all orders
export async function getOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

// Get all products
export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Get order by id
export async function getOrder(id: string): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data || null;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

// Get newsletter subscribers
export async function getNewsletterSubscribers(): Promise<NewsletterSubscription[]> {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return [];
  }
}

// Get customers (users)
export async function getCustomers(): Promise<UserForm[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

// Create new product
export async function createProduct(productData: any) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

// Update product
export async function updateProduct(id: string, productData: any) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

// Delete product
export async function deleteProduct(id: string) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// Update order status
export async function updateOrderStatus(id: string, status: string) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

//Delete order
export async function deleteOrder(id: string) {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
}

//Update order item
export async function updateOrderItem(id: string, orderItemData: any) {
  try {
    const { data, error } = await supabase
      .from('order_items')
      .update(orderItemData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating order item:', error);
    throw error;
  }
}

