const express = require("express");
const { books } = require("./models/books.js");
const app = express();
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const mongo = require("mongodb").MongoClient;
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const dbUrl = "mongodb://localhost:27017/test";

const cors = require("cors");
app.use(cors());

// Data from models
const { video, audio } = require("./models/media");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handlebars setting
app.set("view engine", "hbs");
app.engine(
  "hbs",
  exphbs.engine({
    extname: "hbs",
    defaultLayout: "index",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
  })
);

const port = 8900;
server.listen(port);
console.log(`Listening to server: http://localhost:${port}`);

// Landing page
app.get("/", (req, res) => {
  res.render("main", {
    title: "What This Page Entails",
    video: video,
    audio: audio,
  });
});

// About page
app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

// Contact page
app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact" });
});

// Drag/Drop
app.get("/drag-drop", (req, res) => {
  res.render("drag", { title: "Drag-Drop" });
});

// AJAX
app.get("/ajax", (req, res) => {
  res.render("ajaxPage", { title: "AJAX" });
});

app.get("/ajax-add", (req, res) => {
  res.render("addAjax", { title: "AJAX Add" });
});

app.get("/ajax-update", (req, res) => {
  res.render("ajaxUpdate", { title: "AJAX Update" });
});

//Read all records
app.get("/ajax/books", (req, res) => {
  res.json(books);
});

//Read a single record
app.get("/ajax/:id", (req, res) => {
  let id = req.params.id;
  //find the index of the element that matches the id
  let index = books.findIndex((book) => book.id == id);
  //if found then return the record at the index
  //else return an appropriate message to sender
  let record = index != -1 ? books[index] : "No Record Found.";

  res.json(record);
});

//Insert new data
app.post("/ajax/books", (req, res) => {
  let message = "Cannot insert data. Duplicate record id found!";
  var data = req.body;

  // Prevent duplicate data
  let index = books.findIndex((book) => book.id == data.id);
  if (index == -1) {
    books.push(data);
    message = `The following data: ${data} has been inserted!`;
  }

  res.json(message);
});

//Update an existing record
app.put("/ajax/:id", (req, res) => {
  let id = req.params.id;
  let message = "No Record Found.";

  //find the index of the element that matches the id
  //If a match is found, return the index position
  //else return a -1 (not found)
  let index = books.findIndex((book) => book.id == id);
  if (index != -1) {
    let data = req.body;
    books[index] = data;
    message = "Record Updated.";
  }
  res.json(message);
});

//Delete a single record
app.delete("/ajax/:id", (req, res) => {
  let id = req.params.id;
  let message = "Sorry, No Record Found.";

  //find the index of the element that matches the id
  //If a match is found, return the index position
  //else return a -1 (not found)
  let index = books.findIndex((book) => book.id == id);

  //if found then delete teh record using splice()
  //otherwise return a not found message
  if (index != -1) {
    books.splice(index, 1);
    message = "Record Deleted.";
  }

  res.json(message);
});

//Deleting all records
app.delete("/ajax/", (req, res) => {
  books.splice(0);
  res.json("All Records Deleted.");
});

// Chat
app.get("/chat", (req, res) => {
  res.render("chat", { title: "Chat" });
});
app.get("/api/users", (req, res) => {
  mongo.connect(dbUrl, { useNewUrlParser: true }, function (err, client) {
    const db = client.db("test");
    db.collection("users")
      .find()
      .toArray(function (err, result) {
        if (err) {
          throw err;
        }
        console.log(result);
        console.log(result.length + " documents retrieved.");
        res.render("users", { data: result, layout: false });
        client.close();
      });
  });
});

app.get("/api/users/:userid", function (req, res) {
  const uid = parseInt(req.params.userid);
  console.log(uid);
  mongo.connect(dbUrl, { useNewUrlParser: true }, function (err, client) {
    const db = client.db("test");
    db.collection("users")
      .find({ user_id: uid })
      .toArray(function (err, result) {
        if (err) {
          throw err;
        }
        console.log(result.length + " documents retrieved.");
        res.render("users", { data: result, layout: false });
        client.close();
      });
  });
});

// Error page
app.get("*", (req, res) => {
  res.render("notfound", { title: "Sorry, file not found" });
});

// Chat Program
let usernames = {};

io.sockets.on("connection", function (socket) {
  socket.on("sendchat", function (data) {
    io.sockets.emit("updatechat", socket.username, data);
  });

  socket.on("adduser", function (username) {
    socket.username = username;
    usernames[username] = username;
    socket.emit("updatechat", "SERVER", "you have connected");
    // Broadcast sends to all clients
    socket.broadcast.emit("updatechat", "SERVER", username + " has connected");
    io.sockets.emit("updateusers", usernames);
  });

  socket.on("disconnect", function () {
    delete usernames[socket.username];
    io.sockets.emit("updateusers", usernames);
    socket.broadcast.emit(
      "updatechat",
      "SERVER",
      socket.username + " has disconnected"
    );
  });
});
