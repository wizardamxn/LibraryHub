const authorised = require("../middlewares/authorised");
const Book = require("../models/book");

// Add new book
exports.addBook = async (req, res) => {
  try {
    const { title, author, isbn } = req.body;
    const book = new Book({ title, author, isbn });
    await book.save();
    res.status(201).json({ message: "Book added successfully", book });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserBooks = async (req,res) => {
  try{
    const userId = req.user._id
    const userBooks = await Book.find({borrowedBy: userId})
    res.send(userBooks)
  }
  catch(err){
    console.log(err)
    }
}

// Get all available books
exports.getAvailableBooks = async (req, res) => {
  try {
    const books = await Book.find({ available: true });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Borrow a book
exports.borrowBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) return res.status(404).json({ message: "Book not found" });
    if (!book.available) return res.status(400).json({ message: "Book already borrowed" });

    book.borrowedBy = req.user._id; // comes from authorised middleware
    book.available = false;
    await book.save();

    res.json({ message: "Book borrowed successfully", book });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Return a book
exports.returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.borrowedBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only return books you borrowed" });
    }

    book.available = true;
    book.borrowedBy = null;
    await book.save();

    res.json({ message: "Book returned successfully", book });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
