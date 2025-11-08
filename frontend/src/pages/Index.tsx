import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FilterSection from "@/components/FilterSection";
import BookGrid from "@/components/BookGrid";
import BookDetailsModal from "@/components/BookDetailsModal";
import { Book, fetchBooks } from "@/store/slices/bookSlice";
import { BookOpen, Users, Award, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
const Index = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    dispatch(fetchBooks())
    }, [dispatch]);

  const handleViewDetails = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        <HeroSection />

        {/* Main Content Section */}
        <section className="section-spacing">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="text-center mb-16">
              <div className="space-y-4 animate-fade-in">
                <h2 className="heading-secondary">
                  Explore Our <span className="text-gradient">Collection</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Browse through our carefully curated library of books across
                  various genres. Find your next favorite read with our advanced
                  search and filtering options.
                </p>
              </div>
            </div>

            <div className="content-spacing">
              <BookGrid onViewDetails={handleViewDetails} />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-spacing bg-muted/20">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="text-center mb-16">
              <h2 className="heading-secondary mb-4">
                Why Choose <span className="text-gradient">LibraryHub</span>?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience the future of library management with our modern
                platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              <div className="card-glass p-8 text-center group hover:scale-105 transition-all duration-300">
                <div className="flex-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-lg group-hover:shadow-primary/25 transition-shadow duration-300">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Vast Collection
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Access thousands of books across all genres, from classic
                  literature to modern bestsellers.
                </p>
              </div>

              <div className="card-glass p-8 text-center group hover:scale-105 transition-all duration-300">
                <div className="flex-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-accent to-primary rounded-2xl shadow-lg group-hover:shadow-accent/25 transition-shadow duration-300">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Community Driven
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Join a vibrant community of readers and discover new books
                  through recommendations.
                </p>
              </div>

              <div className="card-glass p-8 text-center group hover:scale-105 transition-all duration-300">
                <div className="flex-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-lg group-hover:shadow-primary/25 transition-shadow duration-300">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Award Winning
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Recognized for excellence in digital library services and user
                  experience.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-primary via-accent to-primary text-white">
        <div className="max-w-7xl mx-auto container-padding section-spacing">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold">LibraryHub</h3>
                  <p className="text-white/80 font-medium">
                    Digital Reading Experience
                  </p>
                </div>
              </div>
              <p className="text-white/90 text-lg leading-relaxed max-w-md">
                Your gateway to endless knowledge and stories. Join thousands of
                readers in our modern digital library ecosystem.
              </p>
              <div className="flex items-center space-x-4">
                <Button
                  variant="secondary"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm rounded-xl font-medium"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us
                </Button>
              </div>
            </div>

            <div className="text-center lg:text-right">
              <div className="text-sm text-white/70 space-y-2">
                <p>© 2024 LibraryHub. All rights reserved.</p>
                <p>Built with React, Redux & Modern Web Technologies</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <BookDetailsModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Index;
