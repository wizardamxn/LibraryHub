import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, RootState } from "@/store/store";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import Profile from "./pages/Profile";

import axios from "axios";
import { useEffect, useState } from "react";
import { addUser, logout } from "./store/slices/authSlice";
import AddBook from "./pages/AddBook";

// ✅ React Query Client
const queryClient = new QueryClient();

/**
 * ProtectedRoute component
 * Blocks access if not logged in
 */
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const [isLoading, setIsLoading] = useState(true);

  // Wait for auth check to complete
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, user]);

  // Show loading while auth is being determined
  if (isLoading && !isAuthenticated && !user) {
    return <div>Loading...</div>; // or your loading component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ✅ Object-based routes
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/add",
    element: (
      <ProtectedRoute>
        <AddBook />
      </ProtectedRoute>
    ),
  },
]);

const App = () => {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  // 🔑 On app load, try to fetch the user (cookie-based session check)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:2222/profile", { 
          withCredentials: true 
        });
        dispatch(addUser(response.data));
      } catch (error) {
        // If the request fails, user is not authenticated
        // No need to dispatch logout if user was never logged in
        console.log("User not authenticated");
        dispatch(logout());
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [dispatch]);

  // Don't render router until auth check is complete
  if (!authChecked) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div>Checking authentication...</div>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Wrap App in Redux provider
const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default Root;