"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mail, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { NewsletterSubscription, ApiResponse } from "@/types/supabase";

export function Newsletter({ email }: { email: string }) {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Check if the user is already subscribed
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        setError(null);
        const response = await fetch(`/api/newsletter?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const result: ApiResponse<NewsletterSubscription[]> = await response.json();

        if (!result.success) {
          throw new Error(result.message || 'Failed to check subscription');
        }

        setIsSubscribed(result.data.some((sub) => sub.email === email && sub.is_active));
      } catch (err: any) {
        setError(err.message || "Failed to check subscription status");
        console.error(err);
      }
    };

    if (email) {
      checkSubscription();
    }
  }, [email]);

  // Handle newsletter subscription
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, is_active: true }),
      });

      const result: ApiResponse<NewsletterSubscription> = await response.json();

      if (!response.ok) {
        // Throw a standard Error with ApiError properties
        throw Object.assign(new Error(), {
          error: result.message || 'Subscription failed',
          message: result.message || 'An error occurred',
          statusCode: response.status,
        });
      }

      if (!result.success) {
        throw new Error(result.message || 'Subscription failed');
      }

      setIsSubscribed(true);
    } catch (err: any) {
      setError(err.message || "Failed to subscribe. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <Badge variant="outline" className="mb-4">
            Stay Updated
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Get the Latest Lighting News</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Subscribe to our newsletter for product updates, industry insights, and exclusive offers delivered straight to
            your inbox.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                readOnly
                className="pl-10 h-12"
                required
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-8" disabled={loading || isSubscribed}>
              {isSubscribed ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Subscribed!
                </>
              ) : (
                loading ? "Subscribing..." : "Subscribe"
              )}
            </Button>
          </form>
          {error && (
            <p className="text-red-500 text-sm" aria-live="polite">
              {error}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Join 5,000+ professionals who trust our insights. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}