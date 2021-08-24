"use strict";

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
      crud
        .getAllBooks()
        .then((books) => res.json(books))
        .catch(() => res.send("no book exists"));
    })

    .post(function (req, res) {
      crud
        .addBook({ title: req.body.title })
        .then((result) => res.json(result))
        .catch((e) => res.send(e.errors.title.message));
    })

    .delete(function (req, res) {
      console.log(req.body);
      crud
        .deleteBook(req.body._id)
        .then(() => res.send("delete successful"))
        .catch(() => res.send("no book exists"));
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
};
