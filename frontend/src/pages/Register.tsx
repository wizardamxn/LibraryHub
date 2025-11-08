import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  User,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);

    try {
      const res = await axios.post(
        API_BASE_URL+"/register",
        {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      navigate("/");

      toast({
        title: "Account Created",
        description:
          "Welcome to Knowledge Hub! Please verify your email to continue.",
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Error Registering",
        description: "Please check the Email or Password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg">
              <Sparkles className="h-8 w-8 text-yellow-300" />
            </div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent">
              Knowledge Hub
            </h1>
          </div>
          <p className="text-sm text-white/80">
            Join thousands of teams using AI to organize knowledge
          </p>
        </div>

        {/* Registration Form */}
        <Card className="bg-white/90 backdrop-blur-md shadow-2xl border-0 rounded-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
            <p className="text-sm text-gray-500">
              Start your AI-powered knowledge journey
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="John Doe"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="you@gmail.com"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Create a strong password"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    placeholder="Confirm your password"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md hover:opacity-90 transition"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <Separator className="my-6" />

            {/* Sign In Link */}
            <div className="text-center text-sm">
              <span className="text-gray-500">Already have an account? </span>
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:underline"
              >
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
