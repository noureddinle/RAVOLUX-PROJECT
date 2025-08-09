"use client"

import type React from "react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { UserInsert, UserForm, ApiResponse } from "@/types/supabase";
import { API_URL } from "@/lib/api";

export function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserForm, token: string) => void; 
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('Auth modal submit:', { mode, formData });

    // Validate form data
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!formData.password) {
      toast({
        title: "Invalid Password",
        description: "Password is required.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (mode === "register") {
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      if (!formData.name) {
        toast({
          title: "Invalid Input",
          description: "Full name is required for registration.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    }

    try {
      const endpoint = mode === "login" ? `${API_URL}/api/auth/login` : `${API_URL}/api/auth/register`;
      const payload: UserInsert = {
        email: formData.email,
        password: formData.password,
        ...(mode === "register" && {
          name: formData.name,
          phone: formData.phone || undefined,
          role: 'user',
          email_notifications: true,
          marketing_emails: true,
        }),
      };

      console.log('Making API request to:', endpoint, payload);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('API response:', result);

      if (!response.ok) {
        throw new Error(result.message || `${mode === "login" ? "Login" : "Registration"} failed`);
      }

      // Handle different response structures
      let userData: UserForm;
      let token: string;

      if (result.user) {
        // Backend returns { user: { ... } }
        userData = result.user;
        token = result.user.accessToken || '';
      } else if (result.data) {
        // Backend returns { data: { ... }, success: true }
        userData = result.data;
        token = result.data.accessToken || '';
      } else {
        // Fallback - assume the entire response is user data
        userData = result;
        token = result.accessToken || '';
      }

      // Ensure we have the required fields
      if (!userData.id || !userData.email) {
        throw new Error('Invalid user data received from server');
      }

      console.log('Calling onAuthSuccess with:', { userData, token });

      // Pass both user data and token to parent
      onAuthSuccess(userData, token);
      
      toast({
        title: mode === "login" ? "Welcome back!" : "Account created!",
        description:
          mode === "login" ? "You have successfully logged in." : "Your account has been created successfully.",
      });

      // Reset form
      setFormData({
        email: "",
        password: "",
        name: "",
        phone: "",
        confirmPassword: "",
      });
      
      // Close modal with a small delay to ensure state updates
      setTimeout(() => {
        onClose();
      }, 100);
    } catch (err: any) {
      console.error('Auth error:', err);
      toast({
        title: "Error",
        description: err.message || `Failed to ${mode === "login" ? "log in" : "register"}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setFormData({
      email: "",
      password: "",
      name: "",
      phone: "",
      confirmPassword: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="pl-10 h-12 border border-gray-300 text-gray-400"
                    required
                  />
                </div>
              </div>
            </>
          )}
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="pl-10 h-12 border border-gray-300 text-gray-400"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="pl-10 pr-10 h-12 border border-gray-300 text-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {mode === "register" && (
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="pl-10 pr-10 h-12 border border-gray-300 text-gray-400"
                  required
                />
              </div>
            </div>
          )}
          <Button type="submit" className="w-full bg-black text-white hover:bg-white hover:text-black h-12" disabled={isLoading}>
            {isLoading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          </p>
          <Button variant="link" onClick={switchMode} className="p-0 h-auto font-semibold">
            {mode === "login" ? "Sign up here" : "Sign in here"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

