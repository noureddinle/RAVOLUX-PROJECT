// src/hooks/use-cart.ts
"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { CartItem, CartItemInsert } from "@/types/supabase";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";
import {API_URL} from "@/lib/api"

interface Cart {
  cart_id: string;
  items: CartItem[];
}

export function useCart() {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize cart on mount
  useEffect(() => {
    async function initializeCart() {
      try {
        let sessionId = localStorage.getItem("session_id");
        if (!sessionId) {
          sessionId = uuidv4();
          localStorage.setItem("session_id", sessionId);
        }

        const body: { user_id?: string; session_id?: string } = {};
        if (user?.id) {
          body.user_id = user.id;
        } else {
          body.session_id = sessionId;
        }

        const response = await fetch(`${API_URL}/api/carts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`Failed to get or create cart: ${response.status}`);
        }

        const { cart_id } = await response.json();
        localStorage.setItem("cart_id", cart_id);

        // Fetch cart items
        const cartResponse = await fetch(`${API_URL}/api/carts/${cart_id}`, {
          headers: { "Content-Type": "application/json" },
        });

        if (!cartResponse.ok) {
          throw new Error(`Failed to fetch cart: ${cartResponse.status}`);
        }

        const cartData = await cartResponse.json();
        setCart({ cart_id, items: cartData.items || [] });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to initialize cart",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    initializeCart();
  }, [user]);

  async function addToCart(item: CartItem) {
    if (!cart?.cart_id) {
      toast({
        title: "Error",
        description: "Cart not initialized",
        variant: "destructive",
      });
      return;
    }

    try {
      const cartItem: CartItemInsert = {
        cart_id: cart.cart_id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price,
        created_at: new Date().toISOString(),
      };

      const response = await fetch(`${API_URL}/api/carts/${cart.cart_id}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user?.accessToken && { Authorization: `Bearer ${user.accessToken}` }),
        },
        body: JSON.stringify(cartItem),
      });

      if (!response.ok) {
        throw new Error(`Failed to add item to cart: ${response.status}`);
      }

      const newItem = await response.json();
      setCart((prev) => ({
        ...prev!,
        items: [...(prev?.items || []), { ...newItem, name: item.name, image: item.image }],
      }));

      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      });
    }
  }

  async function updateCartItem(itemId: string, quantity: number) {
    try {
      const response = await fetch(`${API_URL}/api/carts/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(user?.accessToken && { Authorization: `Bearer ${user.accessToken}` }),
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update cart item: ${response.status}`);
      }

      const updatedItem = await response.json();
      setCart((prev) => ({
        ...prev!,
        items: prev!.items.map((item) =>
          item.id === itemId ? { ...item, quantity: updatedItem.quantity } : item
        ),
      }));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update cart item",
        variant: "destructive",
      });
    }
  }

  async function removeCartItem(itemId: string) {
    try {
      const response = await fetch(`${API_URL}/api/carts/items/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(user?.accessToken && { Authorization: `Bearer ${user.accessToken}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to remove cart item: ${response.status}`);
      }

      setCart((prev) => ({
        ...prev!,
        items: prev!.items.filter((item) => item.id !== itemId),
      }));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove cart item",
        variant: "destructive",
      });
    }
  }

  return { cart, addToCart, updateCartItem, removeCartItem, loading };
}