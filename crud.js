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
  title: { type: String, trim: true, required: "missing required field title" },
  commentrefs: {
    type: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
    default: [],
  },
  comments: { type: [String], default: [] },
  commentcount: { type: Number, default: 0 },
});

const commentSchema = new Schema({
  comment: {
    type: String,
    trim: true,
    required: "missing required field comment",
  },
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
    book.commentrefs.push(comment._id);
    book.comments.push(comment.comment);
    book.save();
  },
  updateCommentcount: (bookId, count) =>
    Book.updateOne({ _id: bookId }, { commentcount: count }),
  deleteBook: async (bookId) => await Book.deleteOne({ _id: bookId }),
  deleteComments: async (bookId) => await Comment.deleteMany({ book: bookId }),
  deleteAllBooks: async () => await Book.deleteMany({}),
  deleteAllComments: async () => await Comment.deleteMany({}),
};

module.exports = crud;
