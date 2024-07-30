process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

beforeEach(async function() {
  await db.query("DELETE FROM books");
  await Book.create({
    isbn: "1234567891",
    amazon_url: "http://a.co/eobPtX2",
    author: "Test Testy",
    language: "english",
    pages: 200,
    publisher: "Test Name",
    title: "Test Title",
    year: 2017
  });
});

afterEach(async function() {
  await db.query("DELETE FROM books");
});

afterAll(async function() {
  await db.end();
});

describe("GET /books", function() {
  test("Gets a list of books", async function() {
    const response = await request(app).get("/books");
    expect(response.statusCode).toBe(200);
    expect(response.body.books.length).toBe(1);
    expect(response.body.books[0]).toHaveProperty("isbn");
  });
});

describe("GET /books/:isbn", function() {
  test("Gets a single book", async function() {
    const response = await request(app).get(`/books/1234567891`);
    expect(response.statusCode).toBe(200);
    expect(response.body.book).toHaveProperty("isbn");
  });

  test("Responds with 400 if can't find book", async function() {
    const response = await request(app).get(`/books/999`);
    expect(response.statusCode).toBe(404);
  });
});

describe("POST /books", function() {
  test("Creates a new book", async function() {
    const newBook = {
      isbn: "1234567885",
      amazon_url: "http://a.co/eobPtX2",
      author: "Ilir Author",
      language: "english",
      pages: 20,
      publisher: "Bababa Name",
      title: "Test Anna",
      year: 2002
    };
    const response = await request(app).post("/books").send(newBook);
    expect(response.statusCode).toBe(201);
    expect(response.body.book).toHaveProperty("isbn");
    expect(response.body.book.isbn).toBe("1234567885");
  });

  test("Prevents creating book without required title", async function() {
    const newBook = {
      isbn: "1234567885",
      amazon_url: "http://a.co/eobPtX2",
      author: "Ilir Author",
      language: "english",
      pages: 20,
      publisher: "Bababa Name",
      year: 2002
    };
    const response = await request(app).post("/books").send(newBook);
    expect(response.statusCode).toBe(400);
  });
});

describe("PUT /books/:isbn", function() {
  test("Updates a single book", async function() {
    const updateData = {
      isbn: "1234567891",
      amazon_url: "http://a.co/eobPtX2",
      author: "New Author",
      language: "english",
      pages: 250,
      publisher: "New Publisher",
      title: "Updated Title",
      year: 2018
    };
    const response = await request(app).put(`/books/1234567891`).send(updateData);
    expect(response.statusCode).toBe(200);
    expect(response.body.book.title).toBe("Updated Title");
  });

  test("Responds with 404 if can't find book", async function() {
    const response = await request(app).put(`/books/999`).send({
      isbn: "999",
      amazon_url: "http://a.co/eobPtX2",
      author: "New Author",
      language: "english",
      pages: 250,
      publisher: "New Publisher",
      title: "Updated Title",
      year: 2018
    });
    expect(response.statusCode).toBe(404);
  });
});


describe("DELETE /books/:isbn", function() {
  test("Deletes a single book", async function() {
    const response = await request(app).delete(`/books/1234567891`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Book deleted" });
  });

  test("Responds with 404 if can't find book", async function() {
    const response = await request(app).delete(`/books/999`);
    expect(response.statusCode).toBe(404);
  });
});
