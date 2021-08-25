"use strict";

const e = require("express");
const crud = require("../crud");

/**
 * Module that handles most of the routing
 * @module ./routes/api
 *
 * @param {*} app   Represents the Express application
 *
 */
module.exports = function (app) {
  app
    .route("/api/books")
    .get(function (req, res) {
      crud.getAllBooks().then((books) => res.json(books));
    })

    .post(function (req, res) {
      crud
        .addBook({ title: req.body.title })
        .then((result) => res.json(result))
        .catch((e) => res.send(e.errors.title.message));
    })

    .delete(function (req, res) {
      crud.deleteAllBooks();
      crud.deleteAllComments();
      res.send("complete delete successful");
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      crud.getBook(req.params.id).then((book) => {
        if (book) {
          res.json(book);
        } else {
          res.send("no book exists");
        }
      });
    })

    .post(function (req, res) {
      let bookid = req.params.id;

      crud.getBook(bookid).then((book) => {
        if (book) {
          crud
            .addComment({ comment: req.body.comment, book: book._id })
            .then((comment) => {
              crud.updateBookComments(book, comment);

              crud
                .updateCommentcount(bookid, book.comments.length)
                .then((result) => {
                  if (result) {
                    crud.getBook(bookid).then((book) => res.json(book));
                  } else {
                    res.send("updating the 'commentcount' property failed");
                  }
                });
            })
            .catch((e) => res.send(e.errors.comment.message));
        } else {
          res.send("no book exists");
        }
      });
    })

    .delete(function (req, res) {
      let bookid = req.params.id;

      crud.getBook(bookid).then((book) => {
        if (book) {
          crud.deleteBook(bookid);
          crud.deleteComments(bookid);
          res.send("delete successful");
        } else {
          res.send("no book exists");
        }
      });
    });
};
