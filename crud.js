require("dotenv").config();
const mongoose = require("mongoose");

// Connects to database
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schemas
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: "missing required field title" },
  comments: {
    type: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
    default: [],
  },
  commentcount: { type: Number, default: 0 },
});

const commentSchema = new Schema({
  thoughts: String,
  book: { type: Schema.Types.ObjectId, ref: "Books" },
});

// Models
const Book = mongoose.model("Books", bookSchema);
const Comment = mongoose.model("Comments", commentSchema);

/**
 * Module for running CRUD operations once connected to the DB
 * @module ./crud
 *
 */
const crud = {
  addBook: (data) => new Book(data).save(),
  addComment: (data) => new Comment(data).save(),
  getBook: (bookId) => Book.findOne({ _id: bookId }),
  getAllBooks: () => Book.find({}),
  getAllComments: (bookId) => Comment.find({ book: bookId }),
  updateBookComments: (book, comment) => {
    book.comments.push(comment);
    book.save();
  },
  updateCommentcount: (bookId, count) => Book.updateOne({ _id: bookId }, count),
  deleteBook: (bookId) => Book.deleteOne({ _id: bookId }),
  deleteComments: (bookId) => Comment.deleteMany({ book: bookId }),
  deleteAllBooks: () => Book.deleteMany({}),
  deleteAllComments: () => Comment.deleteMany({}),
};

module.exports = crud;
