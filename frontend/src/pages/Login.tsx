import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "@/store/slices/authSlice";
import { add } from "date-fns";

interface LoginResponse {
  success: boolean;
  token: string;
  message?: string;
}
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const Login = () => {
  axios.defaults.withCredentials = true;

  const [email, setEmail] = useState("test@gmail.com");
  const navigate = useNavigate();
  const [password, setPassword] = useState("Teset!!!Test13");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post<LoginResponse>(
      API_BASE_URL+ "/login",
        { email, password },
        { withCredentials: true }
      );

      // ✅ Login success
      toast({
        title: "Login Successful",
        description: `Welcome back ${email}`,
      });

      const userData = await axios.get(API_BASE_URL + "/profile", {
        withCredentials: true,
      });
      dispatch(addUser(userData.data));
      navigate("/"); // redirect after success
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Invalid Credentials",
        description: "Invalid Email or Password!",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false); // always stop loading spinner
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg">
              <Sparkles className="h-8 w-8 text-yellow-300" />
            </div>
            <span className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-white">
              LibraryHub
            </span>
          </div>
          <p className="text-sm text-white/80">Sign in to your library</p>
        </div>

        {/* Login Form */}
        <Card className="bg-white/90 backdrop-blur-md shadow-2xl border-0 rounded-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <p className="text-sm text-gray-500">
              Enter your credentials to access your account
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md hover:opacity-90 transition"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  <>
                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              {/* Forgot Password */}
              <div className="text-center">
                <Button variant="link" className="text-sm text-indigo-600">
                  Forgot your password?
                </Button>
              </div>
            </form>

            <Separator className="my-6" />

            {/* Sign Up Link */}
            <div className="text-center text-sm">
              <span className="text-gray-500">Don’t have an account? </span>
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:underline"
              >
                Create Account
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="grid grid-cols-2 gap-4 text-center text-white">
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md shadow-lg">
            <Sparkles className="h-6 w-6 text-yellow-300 mx-auto mb-2" />
            <p className="text-sm font-medium">AI-Powered</p>
          </div>
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md shadow-lg">
            <ArrowRight className="h-6 w-6 text-green-300 mx-auto mb-2" />
            <p className="text-sm font-medium">Collaborative</p>
          </div>
        </div>
      </div>
    </div>
  );
};
