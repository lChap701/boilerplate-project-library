const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const crud = require("../crud");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  test("#example Test GET /api/books", function (done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");

        // Bug fix
        if (res.body.length > 0) {
          assert.property(
            res.body[0],
            "commentcount",
            "Books in array should contain commentcount"
          );
          assert.property(
            res.body[0],
            "title",
            "Books in array should contain title"
          );
          assert.property(
            res.body[0],
            "_id",
            "Books in array should contain _id"
          );
        }
        done();
      });
  });

  /* My tests */
  suite("Routing tests", function () {
    const PATH = "/api/books";
    const data = { title: "Title Test" };

    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          chai
            .request(server)
            .post(PATH)
            .send(data)
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body, "response should be an object");
              assert.property(
                res.body,
                "_id",
                "response should have a property of '_id'"
              );
              assert.propertyVal(
                res.body,
                "title",
                data.title,
                `response should have a property of 'title' with a value of '${data.test}'`
              );
              done();
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .post(PATH)
            .send()
            .end((err, res) => {
              assert.equal(res.status, 200, "response status should be 200");
              assert.equal(
                res.text,
                "missing required field title",
                "response text should equal 'missing required field title'"
              );
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get(PATH)
          .end((err, res) => {
            assert.equal(res.status, 200, "response status should be 200");
            assert.isAtLeast(
              res.body.length,
              1,
              "response should return an array containing at least 1 object"
            );
            assert.property(
              res.body[0],
              "_id",
              "response should contain objects with a property of '_id'"
            );
            assert.property(
              res.body[0],
              "title",
              "response should contain objects with a property of 'title'"
            );
            assert.property(
              res.body[0],
              "commentcount",
              "response should contain objects with a property of 'commentcount'"
            );
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .get(PATH + "/7597e280d35ae174eeddf13c")
          .end((err, res) => {
            assert.equal(res.status, 200, "response status should be 200");
            assert.equal(
              res.text,
              "no book exists",
              "response text should equal 'no book exists'"
            );
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        crud.getAllBooks().then((books) => {
          const book = books[books.length - 1];

          chai
            .request(server)
            .get(PATH + "/" + book._id)
            .end((err, res) => {
              assert.equal(res.status, 200, "response status should be 200");
              assert.isObject(res.body, "response should be an object");
              assert.property(
                res.body,
                "_id",
                "response should contain objects with a property of '_id'"
              );
              assert.property(
                res.body,
                "title",
                "response should have a property of 'title'"
              );
              assert.property(
                res.body,
                "comments",
                "response should have a property of 'comments'"
              );
              assert.isArray(
                res.body.comments,
                "the 'comments' property should be an array"
              );
              assert.isEmpty(
                res.body.comments,
                "the 'comments' property should be an array"
              );
              assert.property(
                res.body,
                "commentcount",
                "response should contain objects with a property of 'commentcount'"
              );
              done();
            });
        });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          const data = { comment: "Comment Test" };

          crud.getAllBooks().then((books) => {
            const book = books[books.length - 1];

            chai
              .request(server)
              .post(PATH + "/" + book._id)
              .send(data)
              .end((err, res) => {
                assert.equal(res.status, 200, "response status should be 200");
                assert.isObject(res.body, "response should be an object");
                assert.property(
                  res.body,
                  "_id",
                  "response should contain objects with a property of '_id'"
                );
                assert.property(
                  res.body,
                  "title",
                  "response should have a property of 'title'"
                );
                assert.property(
                  res.body,
                  "comments",
                  "response should have a property of 'comments'"
                );
                assert.isArray(
                  res.body.comments,
                  "the 'comments' property should be an array"
                );
                assert.equal(
                  res.body.comments[0],
                  data.comment,
                  `the 'comments' property should include ${data.comment}`
                );
                assert.property(
                  res.body,
                  "commentcount",
                  "response should contain objects with a property of 'commentcount'"
                );
                assert.equal(
                  res.body.commentcount,
                  1,
                  "the 'commentcount' property should equal 1"
                );
                done();
              });
          });
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          crud.getAllBooks().then((books) => {
            const book = books[books.length - 1];

            chai
              .request(server)
              .post(PATH + "/" + book._id)
              .send()
              .end((err, res) => {
                assert.equal(res.status, 200, "response status should be 200");
                assert.equal(
                  res.text,
                  "missing required field comment",
                  "response text should equal 'missing required field comment'"
                );
                done();
              });
          });
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          chai
            .request(server)
            .post(PATH + "/7597e280d35ae174eeddf13c")
            .send()
            .end((err, res) => {
              assert.equal(res.status, 200, "response status should be 200");
              assert.equal(
                res.text,
                "no book exists",
                "response text should equal 'no book exists'"
              );
              done();
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        crud.getAllBooks().then((books) => {
          const book = books[books.length - 1];

          chai
            .request(server)
            .delete(PATH + "/" + book._id)
            .end((err, res) => {
              assert.equal(res.status, 200, "response status should be 200");
              assert.equal(
                res.text,
                "delete successful",
                "response text should equal 'delete successful'"
              );
              done();
            });
        });
      });

      test("Test DELETE /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .delete(PATH + "/7597e280d35ae174eeddf13c")
          .end((err, res) => {
            assert.equal(res.status, 200, "response status should be 200");
            assert.equal(
              res.text,
              "no book exists",
              "response text should equal 'no book exists'"
            );
            done();
          });
      });
    });
  });
});
