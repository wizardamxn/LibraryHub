import { Book } from '@/store/slices/bookSlice';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  Star, 
  Hash, 
  User,
  Clock
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { borrowBook, returnBook } from '@/store/slices/bookSlice';
import { toast } from '@/hooks/use-toast';

interface BookDetailsModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

const BookDetailsModal = ({ book, isOpen, onClose }: BookDetailsModalProps) => {
  const dispatch = useDispatch();

  if (!book) return null;

  const handleBorrowBook = () => {
    if (book.availableCount > 0) {
      dispatch(borrowBook(book.id));
      toast({
        title: "Book Borrowed Successfully!",
        description: `You have borrowed "${book.title}". Enjoy your reading!`,
      });
      onClose();
    } else {
      toast({
        title: "Book Unavailable",
        description: "This book is currently out of stock.",
        variant: "destructive",
      });
    }
  };

  const handleReturnBook = () => {
    dispatch(returnBook(book.id));
    toast({
      title: "Book Returned Successfully!",
      description: `Thank you for returning "${book.title}".`,
    });
    onClose();
  };

  const getAvailabilityStatus = () => {
    if (book.availableCount === 0) {
      return { text: 'Out of Stock', variant: 'destructive' as const };
    } else if (book.availableCount <= 2) {
      return { text: 'Limited Stock', variant: 'warning' as const };
    } else {
      return { text: 'Available', variant: 'success' as const };
    }
  };

  const availabilityStatus = getAvailabilityStatus();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{book.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Book Cover and Basic Info */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Book Cover */}
            <div className="w-full md:w-48 h-64 bg-gradient-card rounded-lg flex items-center justify-center shrink-0">
              <BookOpen className="h-24 w-24 text-muted-foreground" />
            </div>
            
            {/* Basic Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg font-medium">{book.author}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary">{book.genre}</Badge>
                    <Badge variant={availabilityStatus.variant}>
                      {availabilityStatus.text}
                    </Badge>
                  </div>
                </div>
                
                {book.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 fill-current text-accent" />
                    <span className="text-lg font-semibold">{book.rating}</span>
                  </div>
                )}
              </div>
              
              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Published: {book.publishedYear}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span>ISBN: {book.isbn}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Available: {book.availableCount}/{book.totalCount}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Due: 14 days</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {book.description || "No description available for this book."}
            </p>
          </div>
          
          {/* Additional Info */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-medium mb-2">Library Information</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Borrowing period: 14 days</p>
              <p>• Renewals: Up to 2 times (if available)</p>
              <p>• Late fees: $0.25 per day</p>
              <p>• Reservations: Available for checked-out books</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button
              onClick={handleBorrowBook}
              disabled={book.availableCount === 0}
              className="flex-1 hero-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {book.availableCount === 0 ? 'Out of Stock' : 'Borrow This Book'}
            </Button>
            
            <Button
              variant="secondary"
              onClick={handleReturnBook}
              className="flex-1"
            >
              Return Book
            </Button>
            
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookDetailsModal;