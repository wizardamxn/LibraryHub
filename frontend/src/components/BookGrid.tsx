import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { useEffect } from 'react';
import { filterBooks } from '@/store/slices/bookSlice';
import BookCard from './BookCard';
import { Book } from '@/store/slices/bookSlice';
import { BookOpen, Search } from 'lucide-react';

interface BookGridProps {
  onViewDetails?: (book: Book) => void;
}

const BookGrid = ({ onViewDetails }: BookGridProps) => {
  const dispatch = useDispatch();
  const { books, filteredBooks, searchTerm } = useSelector((state: RootState) => state.books);

  useEffect(() => {
    dispatch(filterBooks());
  }, [dispatch]);

  const booksToShow = searchTerm ? filteredBooks : books;

  if (booksToShow.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex-center">
            <div className="p-6 bg-muted/50 rounded-2xl">
              {searchTerm ? (
                <Search className="h-12 w-12 text-muted-foreground" />
              ) : (
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              {searchTerm  ? "No books found" : "No books available"}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? "Try adjusting your filters or search terms." 
                : "Check back later for new additions to our collection."
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid-responsive">
      {booksToShow.map((book, index) => (
        <div 
          key={book._id} 
          className="animate-scale-in" 
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <BookCard book={book} onViewDetails={onViewDetails} />
        </div>
      ))}
    </div>
  );
};

export default BookGrid;