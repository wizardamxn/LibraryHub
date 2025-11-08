import { Book } from '@/store/slices/bookSlice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, Users, BookOpen, Heart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { borrowBook, returnBook } from '@/store/slices/bookSlice';
import { toast } from '@/hooks/use-toast';

interface BookCardProps {
  book: Book;
  onViewDetails?: (book: Book) => void;
}

const BookCard = ({ book, onViewDetails }: BookCardProps) => {
  const dispatch = useDispatch();

  const handleBorrowBook = () => {
    if (book.available === true) {
      dispatch(borrowBook(book._id));
      toast({
        title: "Book Borrowed Successfully!",
        description: `You have borrowed "${book.title}". Enjoy your reading!`,
      });
    } else {
      toast({
        title: "Book Unavailable",
        description: "This book is currently out of stock.",
        variant: "destructive",
      });
    }
  };

  const handleReturnBook = () => {
    dispatch(returnBook(book._id));
    toast({
      title: "Book Returned Successfully!",
      description: `Thank you for returning "${book.title}".`,
    });
  };

  const getAvailabilityStatus = () => {
    if (book.available === false) {
      return { text: 'Out of Stock', variant: 'destructive' as const };
    } 
    else {
      return { text: 'Available', variant: 'success' as const };
    }
  };

  const availabilityStatus = getAvailabilityStatus();

  return (
    <div className="card-interactive p-0 overflow-hidden group">
      {/* Book Cover */}
      <div className="relative">
        <div className="w-full h-56 bg-gradient-to-br from-muted via-card to-muted/50 flex items-center justify-center group-hover:from-primary/5 group-hover:to-accent/5 transition-colors duration-300">
          <BookOpen className="h-20 w-20 text-muted-foreground/50 group-hover:text-primary/40 transition-colors duration-300" />
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <Badge variant={availabilityStatus.variant} className="shadow-md font-medium">
            {availabilityStatus.text}
          </Badge>
        </div>
        
        {/* Rating */}
        {book.rating && (
          <div className="absolute top-4 right-4 flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md">
            <Star className="h-3.5 w-3.5 fill-current text-accent" />
            <span className="text-sm font-semibold text-foreground">{book.rating}</span>
          </div>
        )}
        
        {/* Quick Action */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white border-0"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title & Author */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors duration-200 line-clamp-2">
            {book.title}
          </h3>
          <p className="text-muted-foreground font-medium">by {book.author}</p>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{book.publishedYear}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span className="font-medium">{book.availableCount}/{book.totalCount}</span>
          </div>
        </div>

        {/* Genre */}
        <div>
          <Badge variant="secondary" className="bg-muted/50 text-muted-foreground hover:bg-muted/70">
            {book.genre}
          </Badge>
        </div>

        {/* Description */}
        {book.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {book.description}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col space-y-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(book)}
            className="w-full rounded-xl font-medium border-border/50 hover:border-primary/50 hover:bg-primary/5"
          >
            View Details
          </Button>
          
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={handleBorrowBook}
              disabled={book.availableCount === 0}
              className="flex-1 hero-button rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Borrow
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleReturnBook}
              className="flex-1 rounded-xl font-medium bg-muted/50 hover:bg-muted"
            >
              Return
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;