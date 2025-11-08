import { Search, BookOpen, Users, Award, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDispatch } from 'react-redux';
import { setSearchTerm } from '@/store/slices/bookSlice';

const HeroSection = () => {
  const dispatch = useDispatch();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get('search') as string;
    if (searchValue) {
      dispatch(setSearchTerm(searchValue));
    }
  };

  return (
    <section className="hero-section">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-accent/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-12 h-12 bg-white/5 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-24 h-24 bg-primary/10 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      <div className="relative z-10 mt-4 mb-4 sm:mt-10 sm:mb-10 container-padding max-w-7xl mx-auto text-center">
        <div className="animate-fade-in max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-8">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-white font-medium">Welcome to the Future of Reading</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Your Digital
            <span className="block text-gradient bg-gradient-to-r from-accent to-white bg-clip-text text-transparent">
              Library Experience
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Discover, explore, and manage your reading journey with our modern library platform. 
            Thousands of books at your fingertips.
          </p>
          
          {/* Enhanced Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground z-10" />
                <Input
                  type="text"
                  name="search"
                  placeholder="Search for books, authors, or genres..."
                  className="pl-16 pr-40 py-8 text-lg bg-white/95 backdrop-blur-sm border-0 rounded-2xl shadow-2xl focus:shadow-accent/25 transition-all duration-300"
                />
                <Button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hero-button px-8 py-3 rounded-xl"
                >
                  Search
                </Button>
              </div>
            </div>
          </form>
          
          {/* CTA Buttons */}
         
        </div>
        

        
      </div>
    </section>
  );
};

export default HeroSection;