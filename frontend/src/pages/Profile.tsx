import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Mail,
  BookOpen,
  Clock,
  ArrowLeft,
  Edit3,
  Settings,
  Trophy,
  Star,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { returnBook } from "@/store/slices/bookSlice";
import { RootState } from "@/store/store";

// Define types for better type safety
interface Book {
  _id: string;
  title: string;
  author: string;
  status: "active" | "returned";
  borrowedAt?: string;
  returnedAt?: string;
}

interface User {
  fullName: string;
  email: string;
  createdAt: string;
}
const API_BASE_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const navigate = useNavigate();
  const userData = useSelector((store: RootState) => store.auth.user) as User | null;
  const [activeTab, setActiveTab] = useState("overview");
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  // Fetch borrowed books with proper error handling
  const getBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(API_BASE_URL+"/api/books/mybooks", {
        withCredentials: true,
      });
      setBorrowedBooks(res?.data || []);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to fetch borrowed books");
      setBorrowedBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const handleBackButton = () => {
    navigate(-1);
  };

  // Handle return with proper error handling and loading state
  const handleReturn = async (_id: string) => {
    try {
      await dispatch(returnBook(_id)).unwrap();
      // Update UI instantly after returning
      setBorrowedBooks((prev) =>
        prev.map((book) =>
          book._id === _id ? { ...book, status: "returned" } : book
        )
      );
    } catch (err) {
      console.error("Error returning book:", err);
      setError("Failed to return book");
    }
  };

  const activeBooks = borrowedBooks?.filter((book) => book.status === "active") || [];
  const returnedBooks = borrowedBooks?.filter((book) => book.status === "returned") || [];

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "borrowed", label: "Borrowed Books", icon: BookOpen },
    { id: "history", label: "Reading History", icon: Clock },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-700">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 relative">
            <div className="absolute inset-0 bg-black/20"></div>
            <button
              onClick={handleBackButton}
              className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="relative px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="relative -mt-16">
                <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl flex items-center justify-center border-4 border-white">
                  <User className="h-16 w-16 text-white" />
                </div>
                <button 
                  className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
                  aria-label="Edit profile"
                >
                  <Edit3 className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {userData?.fullName || "Guest User"}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{userData?.email || "No email provided"}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    <Trophy className="h-4 w-4" />
                    <span>Active Reader</span>
                  </div>
                  <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                    <Star className="h-4 w-4" />
                    <span>Member</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {activeBooks.length}
              </span>
            </div>
            <p className="text-gray-600 text-sm">Currently Borrowed</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-green-600">
                {returnedBooks.length}
              </span>
            </div>
            <p className="text-gray-600 text-sm">Books Returned</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-purple-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-purple-600">
                {borrowedBooks.length}
              </span>
            </div>
            <p className="text-gray-600 text-sm">Total Books</p>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 whitespace-nowrap font-medium transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? "border-indigo-500 text-indigo-600 bg-indigo-50/50"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    aria-selected={activeTab === tab.id}
                  >
                    <IconComponent className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "borrowed" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Borrowed Books
                  </h2>
                  <div className="flex gap-3">
                    <button
                      onClick={getBooks}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>
                </div>

                {borrowedBooks.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No borrowed books
                    </h3>
                    <p className="text-gray-600">
                      You haven't borrowed any books yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {borrowedBooks.map((book) => (
                      <div
                        key={book._id}
                        className={`border rounded-xl p-6 hover:shadow-md transition-shadow ${
                          book.status === "returned" 
                            ? "border-green-200 bg-green-50" 
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex gap-4">
                          <div className="w-16 h-24 bg-gray-100 rounded-lg shadow-sm flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-gray-400" />
                          </div>

                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">
                              {book.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3">
                              by {book.author}
                            </p>
                            
                            <div className="flex items-center gap-2 mb-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                book.status === "returned" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-blue-100 text-blue-800"
                              }`}>
                                {book.status === "returned" ? "Returned" : "Active"}
                              </span>
                            </div>

                            {book.status !== "returned" && (
                              <button
                                onClick={() => handleReturn(book._id)}
                                className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                              >
                                Return Book
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "overview" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Account Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Personal Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <p className="text-gray-900">
                          {userData?.fullName || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <p className="text-gray-900">
                          {userData?.email || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Member Since
                        </label>
                        <p className="text-gray-900">
                          {userData?.createdAt ? formatDate(userData.createdAt) : "Not available"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Reading Statistics
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Currently Borrowed:</span>
                        <span className="font-medium">{activeBooks.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Books Returned:</span>
                        <span className="font-medium">{returnedBooks.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Books:</span>
                        <span className="font-medium">{borrowedBooks.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Reading History
                </h2>
                {returnedBooks.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No reading history yet
                    </h3>
                    <p className="text-gray-600">
                      Your returned books will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {returnedBooks.map((book) => (
                      <div key={book._id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900">{book.title}</h4>
                        <p className="text-gray-600 text-sm">by {book.author}</p>
                        <p className="text-green-600 text-sm mt-2">✓ Returned</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Account Settings
                </h2>
                <div className="text-center py-12">
                  <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Settings panel coming soon
                  </h3>
                  <p className="text-gray-600">
                    Manage your account preferences and notifications here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;