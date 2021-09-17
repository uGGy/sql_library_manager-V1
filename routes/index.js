const express = require('express');
const book = require('../models/book');
const router = express.Router();
const Book = require('../models').Book;


function asyncHandler(cb) {
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (error) {
      next(error);
    }
  }
}

/* GET home page. */
router.get('/', asyncHandler(async (req, res, next) => {
  res.redirect('/books');
}));


router.get('/books', asyncHandler(async(req, res) => {  
  const books = await Book.findAll({ order: [[ "title", "ASC" ]] });
  res.render("books/all_books", { books, title: "Sequelize"});
}));

// Create a new book form
router.get('/books/new', function(req, res) {
  res.render("books/new-book", { book: {}, title: "New Book"});
});

// POST create book
router.post('/books/new', asyncHandler(async (req, res) => {
  let book; 
  try {
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("books/new-book", { book, errors: error.errors, title: "New Book"})
    } else {
      throw Error;
    }

  }

}));


// Get Individual Book
router.get('/books/:id', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render('books/update-book', { book, title: book.title})
    } else {
      res.sendStatus(404);
    }
}));


// //Update Book

router.post('/books/:id', asyncHandler(async (req, res) => {
  let book; 
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/books/" + book.id); 
    } else {
      res.sendStatus(404);
    }
   } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; 
      res.render("books/update-book", { book, errors: error.errors, title: "Update Book"})
    } else {
      throw Error;
    }
  }

}));

// Delete Individual Book 
router.post('/books/:id/delete', asyncHandler( async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    res.sendStatus(404);
  }
}));


module.exports = router;
