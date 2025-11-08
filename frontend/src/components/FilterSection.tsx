import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setSelectedGenre } from '@/store/slices/bookSlice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';

const FilterSection = () => {
  const dispatch = useDispatch();
  const { books, selectedGenre, searchTerm } = useSelector((state: RootState) => state.books);

  // Get unique genres from books
  const genres = Array.from(new Set(books.map(book => book.genre)));

  const handleGenreFilter = (genre: string) => {
    dispatch(setSelectedGenre(selectedGenre === genre ? '' : genre));
  };

  const clearFilters = () => {
    dispatch(setSelectedGenre(''));
  };

  const hasActiveFilters = selectedGenre || searchTerm;

  return (
    <div className="card-glass border-border/30 p-8 mb-12 backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl">
              <Filter className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Filter Collection</h3>
              <p className="text-sm text-muted-foreground">Discover books by genre</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {genres.map((genre) => (
              <Button
                key={genre}
                variant={selectedGenre === genre ? "default" : "outline"}
                size="sm"
                onClick={() => handleGenreFilter(genre)}
                className={`rounded-xl font-medium transition-all duration-200 ${
                  selectedGenre === genre 
                    ? "hero-button shadow-md" 
                    : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                {genre}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col items-start lg:items-end space-y-4">
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  Search: "{searchTerm}"
                </Badge>
              )}
              {selectedGenre && (
                <Badge variant="default" className="hero-button shadow-sm">
                  {selectedGenre}
                </Badge>
              )}
            </div>
          )}
          
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-muted-foreground hover:text-destructive rounded-xl font-medium group"
            >
              <X className="h-4 w-4 mr-1 group-hover:rotate-90 transition-transform duration-200" />
              Clear All Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSection;