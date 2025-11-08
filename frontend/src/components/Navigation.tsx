import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  Search,
  BookOpen,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setSearchTerm } from "@/store/slices/bookSlice";
import { logout } from "@/store/slices/authSlice";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dispatch = useDispatch();
  const { searchTerm } = useSelector((state: RootState) => state.books);
  const user = useSelector((store: RootState) => store.auth.user);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = (value: string) => {
    dispatch(setSearchTerm(value));
  };

  const handleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleProfileNavigation = () => {
    navigate("/profile");
    setIsProfileOpen(false);
    setMobileMenuOpen(false);
  };
const API_BASE_URL = import.meta.env.VITE_API_URL;

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple logout calls

    setIsLoggingOut(true);

    try {
      await axios.post(
        API_BASE_URL+"/logout",
        {},
        { withCredentials: true }
      );

      // Clear local state and Redux
      dispatch(logout());

      // Close menus
      setIsProfileOpen(false);
      setMobileMenuOpen(false);

      // Navigate to login
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout API fails, clear local state
      dispatch(logout());
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleAuthNavigation = (path: string) => {
    navigate("/login");
    setMobileMenuOpen(false);
  };
  const handleAdd = () => {
    navigate('/add')
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [window.location.pathname]);

  const navLinks = [
    { name: "Browse", path: "#" },
    { name: "Categories", path: "#" },
    { name: "Library", path: "#" },
    { name: "Community", path: "#" },
  ];

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-border/20 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex-between h-20">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  LibraryHub
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Digital Reading
                </span>
              </div>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex items-center space-x-10">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `nav-link relative transition ${
                      isActive
                        ? "text-indigo-600 font-semibold after:absolute after:left-0 after:bottom-[-6px] after:h-[2px] after:w-full after:bg-indigo-600 after:rounded-full"
                        : "hover:text-indigo-500"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
              <Input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 w-72 bg-muted/50 border-border/50 focus:ring-2 focus:ring-indigo-500 focus:bg-white rounded-xl transition"
                aria-label="Search books"
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-4" ref={dropdownRef}>
              {user ? (
                <div className="relative">
                  <button
                    onClick={handleProfile}
                    className="flex items-center space-x-2 bg-muted/50 rounded-xl px-4 py-2 hover:border cursor-pointer transition-colors"
                    aria-label="User menu"
                    aria-expanded={isProfileOpen}
                  >
                    <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-sm">{user.fullName}</span>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl border animate-fade-in">
                      <div className="py-2">
                        <button
                          onClick={handleProfileNavigation}
                          className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-t-xl transition-colors"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </button>
                        <button onClick={handleAdd} className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors">
                          <Settings className="h-4 w-4 mr-2" />
                          Add
                        </button>
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          {isLoggingOut ? "Logging out..." : "Logout"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAuthNavigation("/login")}
                    className="rounded-xl font-medium hover:text-indigo-600"
                  >
                    Login
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAuthNavigation("/register")}
                    className="rounded-xl font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow hover:opacity-90"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border/20 bg-background/98 backdrop-blur-md animate-slide-down">
          <div className="container-padding py-6 space-y-6">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 w-full bg-muted/50 border-border/50 rounded-xl"
                aria-label="Search books"
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Mobile Links */}
            <div className="space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block nav-link rounded-xl py-2 px-3 transition ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600 font-semibold"
                        : "hover:bg-muted/50"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Mobile Auth */}
            <div className="pt-4 border-t border-border/20">
              {user ? (
                <div className="space-y-2">
                  <div
                    onClick={handleProfileNavigation}
                    className="flex items-center space-x-3 bg-muted/50 rounded-xl p-4 cursor-pointer hover:bg-gray-400"
                  >
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full ">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium">{user.fullName}</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full justify-start text-red-600 hover:bg-red-50 rounded-xl disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAuthNavigation("/login")}
                    className="w-full rounded-xl font-medium hover:text-indigo-600"
                  >
                    Login
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAuthNavigation("/register")}
                    className="w-full rounded-xl font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow hover:opacity-90"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
