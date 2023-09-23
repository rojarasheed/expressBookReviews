const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
}); 

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const fetchBooks = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });
      fetchBooks.then(() => console.log("Books fetched successfully"));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

  const fetchDetails = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    resolve(res.send(books[isbn]));
  });
  fetchDetails.then(() => console.log("Details fetched successfully"));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  
  const fetchDetails = new Promise((resolve, reject) => {
    const author = req.params.author;
    let selectedBooks = []
    Object.entries(books).forEach(([key, value]) => {
        if(value.author == author) {
            selectedBooks.push(value)
     }
    });
    resolve(res.send(selectedBooks));
});
fetchDetails.then(() => console.log("Details fetched successfully"));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here

  const fetchBooks = new Promise((resolve, reject) => {
    const title = req.params.title;
    let selectedBooks = []
    Object.entries(books).forEach(([key, value]) => {
        if(value.title == title) {
            selectedBooks.push(value)
        }
    });
    resolve(res.send(selectedBooks));
  });
  fetchBooks.then(() => console.log("Books fetched successfully"));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews)
});

module.exports.general = public_users;
