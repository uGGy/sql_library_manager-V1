const express = require('express');
const book = require('../models/book');
const router = express.Router();
const Book = require('../models').Book;


function asyncHandler(cb) {
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

/* GET home page. */
router.get('/', asyncHandler(async (req, res, next) => {
  res.redirect('/books');
}));


router.get('/books', asyncHandler(async(req, res) => {  
  const books = await Book.findAll();
  res.render("books/all_books", { books, title: "Sequelize"});
}));

// Create a new book 
router.get('/books/new', function(req, res) {
  res.render("books/new-book", { book: {}, title: "New Book"});
});

// POST create book
router.post('/books/index/', asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/books/" + book.id);
    } catch (error) {
      if(error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("books/new-book", { book, errors: error.errors, title: "New Book" })
      } else {
        throw error;
      }
    }
}));

// Get Individual Book
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("books/update-book", { book: book, title: book.title });
  } else {
    res.sendStatus(404);
  }
}));

//Edit Book
// router.get("/books/:id/edit", asyncHandler(async (req, res) => {
//   const book = await Book.findByPk(req.params.id);
//   res.render("books/update-book", { book, title: "Edit"});
// }));

// Update a book
router.post('books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.update(req.body);
    res.redirect("/books/" + book.id);
  } else {
    res.sendStatus(404);
    }
}));

/* Update a Book V1 */
// router.post('/books/:id/edit', asyncHandler(async (req, res) => {
//   const book = await Book.findByPk(req.params.id);
//   await book.update(req.body);
//   if (book) {
//     res.redirect("/books/" + book.id);
//   } else {
//     res.sendStatus(404);
//   }
// }));


//Update a Book V2
// router.put('/books/:id', function(req, res) {
//   Book.findByPk(req.params.id).then(function(book) {
//     return book.update(req.body);
//   }).then(function(book) {
//     res.redirect("/books/" + book.id)
//   });

// });

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
