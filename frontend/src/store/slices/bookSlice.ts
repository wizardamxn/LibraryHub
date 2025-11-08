import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  available: boolean;
  borrowedBy?: string | null;
}
interface BookState {
  books: Book[];
  filteredBooks: Book[];
  myBooks: Book[]; // ✅ new
  searchTerm: string;
  loading: boolean;
  myBooksLoading: boolean; // ✅ new
  error: string | null;
}

const initialState: BookState = {
  books: [],
  filteredBooks: [],
  myBooks: [], // ✅ init empty
  searchTerm: "",
  loading: false,
  myBooksLoading: false, // ✅ init false
  error: null,
};

// Async thunk to fetch books from API
export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_BASE_URL + "/api/books", {
        withCredentials: true, // ✅ keep cookies/session
      });
      return res.data as Book[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const borrowBook = createAsyncThunk(
  "books/borrowBook",
  async (_id: string, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/books/borrow/${_id}`,
        {},
        { withCredentials: true } // ✅ keep cookies/session
      );
      return res.data; // may just be a success message
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const returnBook = createAsyncThunk(
  "books/returnBook",
  async (_id: string, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/books/return/${_id}`,
        {},
        { withCredentials: true } // ✅ keep cookies/session
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const myBooks = createAsyncThunk("books/mybooks", async () => {
  try {
    const res = await axios.get(API_BASE_URL + "/api/books/mybooks", {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
});

export const addBook = createAsyncThunk(
  "books/addBook",
  async (bookData: { title: string; author: string; isbn: string }) => {
    const res = await axios.post(API_BASE_URL + "/api/books/add", bookData, {
      withCredentials: true,
    });
    return res.data as Book;
  }
);

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      bookSlice.caseReducers.filterBooks(state);
    },
    filterBooks: (state) => {
      let filtered = state.books.filter((book) => book.available); // ✅ only available

      if (state.searchTerm) {
        filtered = filtered.filter(
          (book) =>
            book.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
      }

      state.filteredBooks = filtered;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.loading = false;
        state.books = action.payload.filter((book) => book.available); // ✅ filter out unavailable
        bookSlice.caseReducers.filterBooks(state);
      })
      .addCase(fetchBooks.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchBooks cases same as before ...

      .addCase(borrowBook.fulfilled, (state, action) => {
        const bookId = action.meta.arg as string;

        // remove from available books
        state.books = state.books
          .map((book) =>
            book._id === bookId ? { ...book, available: false } : book
          )
          .filter((book) => book.available);

        // also add to myBooks (if backend returned full book, use that instead)
        if (action.payload && typeof action.payload === "object") {
          state.myBooks.push(action.payload as Book);
        }

        bookSlice.caseReducers.filterBooks(state);
      })

      .addCase(returnBook.fulfilled, (state, action) => {
        const bookId = action.meta.arg as string;

        // remove from myBooks
        state.myBooks = state.myBooks.filter((b) => b._id !== bookId);

        // add back to available books
        if (action.payload && typeof action.payload === "object") {
          state.books.push(action.payload as Book);
        } else {
          state.books.push({
            _id: bookId,
            title: "Unknown",
            author: "Unknown",
            isbn: "",
            available: true,
          });
        }

        bookSlice.caseReducers.filterBooks(state);
      })

      // ✅ myBooks thunk
      .addCase(myBooks.pending, (state) => {
        state.myBooksLoading = true;
        state.error = null;
      })
      .addCase(myBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.myBooksLoading = false;
        state.myBooks = action.payload;
      })
      .addCase(myBooks.rejected, (state, action: any) => {
        state.myBooksLoading = false;
        state.error = action.payload;
      })

      .addCase(addBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBook.fulfilled, (state, action: PayloadAction<Book>) => {
        state.loading = false;
        state.books.push(action.payload);
      })
      .addCase(addBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add book";
      });
  },
});

export const { setSearchTerm, filterBooks, setLoading, setError } =
  bookSlice.actions;

export default bookSlice.reducer;
