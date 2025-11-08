import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { addBook } from "@/store/slices/bookSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { X, Plus, BookOpen, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FormData {
  title: string;
  author: string;
  isbn: string;
  description?: string;
  genre?: string;
  publicationYear?: string;
  pages?: string;
  language?: string;
  tags?: string[];
}

interface FormErrors {
  title?: string;
  author?: string;
  isbn?: string;
  publicationYear?: string;
  pages?: string;
}

const AddBook: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.books);
  const navigate = useNavigate()

  const [formData, setFormData] = useState<FormData>({
    title: "",
    author: "",
    isbn: "",
    description: "",
    genre: "",
    publicationYear: "",
    pages: "",
    language: "English",
    tags: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [newTag, setNewTag] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const genres = [
    "Fiction", "Non-Fiction", "Mystery", "Romance", "Science Fiction", 
    "Fantasy", "Biography", "History", "Self-Help", "Business", "Poetry", "Other"
  ];

  const languages = ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Other"];

  useEffect(() => {
    if (!loading && !error && showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [loading, error, showSuccess]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.author.trim()) {
      newErrors.author = "Author is required";
    }

    if (!formData.isbn.trim()) {
      newErrors.isbn = "ISBN is required";
    } else if (!/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/.test(formData.isbn.replace(/\s/g, ""))) {
      newErrors.isbn = "Please enter a valid ISBN";
    }

    if (formData.publicationYear && (!/^\d{4}$/.test(formData.publicationYear) || 
        parseInt(formData.publicationYear) < 1000 || 
        parseInt(formData.publicationYear) > new Date().getFullYear())) {
      newErrors.publicationYear = "Please enter a valid year";
    }

    if (formData.pages && (!/^\d+$/.test(formData.pages) || parseInt(formData.pages) <= 0)) {
      newErrors.pages = "Pages must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), newTag.trim()]
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   

    try {
      await dispatch(addBook(formData)).unwrap();
      setFormData({
        title: "",
        author: "",
        isbn: "",
        description: "",
        genre: "",
        publicationYear: "",
        pages: "",
        language: "English",
        tags: [],
      });
      setShowSuccess(true);
    } catch (err) {
      // Error is handled by Redux state
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      isbn: "",
      description: "",
      genre: "",
      publicationYear: "",
      pages: "",
      language: "English",
      tags: [],
    });
    setErrors({});
  };

  const handleBack = () =>{ 
    navigate(-1)
  }


  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
        <div className="m-2 hover:border w-6 h-6" onClick={handleBack} >
            <ArrowLeft></ArrowLeft>
        </div>
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="h-7 w-7 text-blue-600" />
        <h2 className="text-3xl font-bold text-gray-800">Add New Book</h2>
      </div>

      {showSuccess && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Book added successfully!
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* Required Fields Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Required Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium block">
                Title *
              </label>
              <Input
                id="title"
                name="title"
                placeholder="Enter book title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="author" className="text-sm font-medium block">
                Author *
              </label>
              <Input
                id="author"
                name="author"
                placeholder="Enter author name"
                value={formData.author}
                onChange={handleChange}
                className={errors.author ? "border-red-500" : ""}
              />
              {errors.author && <p className="text-red-500 text-sm">{errors.author}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="isbn" className="text-sm font-medium block">
              ISBN *
            </label>
            <Input
              id="isbn"
              name="isbn"
              placeholder="Enter ISBN (e.g., 978-3-16-148410-0)"
              value={formData.isbn}
              onChange={handleChange}
              className={errors.isbn ? "border-red-500" : ""}
            />
            {errors.isbn && <p className="text-red-500 text-sm">{errors.isbn}</p>}
          </div>
        </div>

        {/* Optional Fields Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Additional Information</h3>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium block">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter a brief description of the book"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="genre" className="text-sm font-medium block">
                Genre
              </label>
              <select
                id="genre"
                value={formData.genre}
                onChange={(e) => handleSelectChange("genre", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select genre</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="language" className="text-sm font-medium block">
                Language
              </label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => handleSelectChange("language", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="publicationYear" className="text-sm font-medium block">
                Publication Year
              </label>
              <Input
                id="publicationYear"
                name="publicationYear"
                placeholder="e.g., 2023"
                value={formData.publicationYear}
                onChange={handleChange}
                className={errors.publicationYear ? "border-red-500" : ""}
              />
              {errors.publicationYear && (
                <p className="text-red-500 text-sm">{errors.publicationYear}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="pages" className="text-sm font-medium block">
                Number of Pages
              </label>
              <Input
                id="pages"
                name="pages"
                placeholder="e.g., 350"
                value={formData.pages}
                onChange={handleChange}
                className={errors.pages ? "border-red-500" : ""}
              />
              {errors.pages && <p className="text-red-500 text-sm">{errors.pages}</p>}
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium block">Tags</label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:bg-gray-300 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Adding Book..." : "Add Book"}
          </Button>
          <Button
            variant="outline"
            onClick={resetForm}
            disabled={loading}
            className="px-6"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddBook;