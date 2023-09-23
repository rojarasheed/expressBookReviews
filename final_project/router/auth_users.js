const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
    username: 'username1',
    password: 'password1',
}];

const isValid = (username)=>{ //returns boolean
    let usernames = users.filter((user)=>{
        return user.username === username
      });
      if(usernames.length > 0){
        return false;
      } else {
        return true;
      }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {accessToken,username}
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const currentUser = req.session.authorization.username
    const bookReview = req.params.review;
    const isbn = req.params.isbn;
    let bookReviews = books[isbn].reviews;
    let reviewAdded = false;
    for (const username in bookReviews) {
        if (username === currentUser) {
            bookReviews[currentUser] = bookReview;
            reviewAdded = true;
            break;
        }
    }
    if (!reviewAdded) {
        bookReviews[currentUser] = bookReview;
    }
    res.send("The review for the book with isbn "+isbn+" has been added/updated successfully.");

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let selectedBook = books[isbn];
    if (selectedBook) {
        let currentUser = req.session.authorization['username'];
        if(selectedBook['reviews'][currentUser]){
            delete selectedBook['reviews'][currentUser]
        }
        res.send("Review for the book with isbn "+isbn+" deleted");
    }
    else{
        res.send("Book with this ISBN cannot be found");
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
