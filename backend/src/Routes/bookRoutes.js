const express = require("express");
const router = express.Router();
const bookController = require("../controller/bookController");
const authorised = require("../middlewares/authorised");

// Public
router.get("/", bookController.getAvailableBooks);

// Protected
router.post("/", authorised, bookController.addBook);
router.put("/borrow/:id", authorised, bookController.borrowBook);
router.put("/return/:id", authorised, bookController.returnBook);
router.post("/add", authorised, bookController.addBook);
router.get("/mybooks", authorised, bookController.getUserBooks);

module.exports = router;
