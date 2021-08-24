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
      crud
        .deleteAllBooks()
        .then(() =>
          crud
            .deleteAllComments()
            .then(() => res.send("complete delete successful"))
        );
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

      async () => {
        try {
          const book = await crud.getBook(bookid);

          if (book) {
            const comment = await crud.addComment({
              comment: req.body.comment,
              book: book,
            });
            console.log(comment);

            crud.updateBookComments(book, comment);
            console.log(book);
            const result = await crud.updateCommentcount(
              bookid,
              book.comments.length
            );

            res.json(result);
          } else {
            res.send("no book exists");
          }
        } catch (e) {
          console.log(e);
          let message =
            e.errors !== undefined
              ? e.errors.comment.message
              : "An unknown error occurred";

          res.send(message);
        }
      };
    })

    .delete(function (req, res) {
      let bookid = req.params.id;

      crud
        .deleteBook(bookid)
        .then(() =>
          crud.deleteComments(bookid).then(() => res.send("delete successful"))
        )
        .catch(() => res.send("no book exists"));
    });
};
