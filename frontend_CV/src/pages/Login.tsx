import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient(); // To invalidate queries if needed, though not strictly necessary for login

  // Mutation for login API call
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      // Assuming the backend returns a 'token' field
      localStorage.setItem("token", data.token);
      toast({
        title: "Login Successful!",
        description: "Welcome back!",
        variant: "success",
      });
      // Invalidate any relevant queries if necessary (e.g., user data)
      queryClient.invalidateQueries(["userStatus"]); // A hypothetical query key for user status
      // Redirect to home page
      navigate("/");
      // Manually trigger a storage event to notify Header component
      window.dispatchEvent(new Event('storage'));
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-xl glass-card border-primary/20 animate-fade-in">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">Admin Login</CardTitle>
          <p className="text-muted-foreground">Enter your credentials to access the dashboard.</p>
          {/* New message added here */}
          <p className="text-sm text-primary-foreground/70 font-medium">Only owner can log in.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ronighosh494@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus:ring-primary focus:border-primary"
              />
            </div>
            <Button
              type="submit"
              className="w-full hover-scale"
              disabled={loginMutation.isLoading}
            >
              {loginMutation.isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;