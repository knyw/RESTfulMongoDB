/**
 * Created on November 6, 2019
 * @author Kenny Wu
 */
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser")
const fs = require('fs');
const path = require("path");
const port = 10030;
dotenv.config();

//app.get("/", (req, res) => res.send("Hello World!"))

const mongoDB = ("mongodb+srv://"+
                 process.env.USERNAME+
                 ":"
                 +process.env.PASSWORD+
                 "@"
                 +process.env.HOST+
                 "/"
                 +process.env.DATABASE);

mongoose.connect(mongoDB, {useNewUrlParser: true, retryWrites: true, useUnifiedTopology: true});
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + "Project_3");
    mongoose.connection.db.listCollections().toArray(function (err, names) {
        //console.log(names);
        var collection = []
        for (var idx = 0; idx < names.length; idx++) {
            collection.push(names[idx].name);
        }
        module.exports.collection = collection;
    });
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected.');
});


// use stylesheet in /public folder
app.use(express.static(__dirname + "public"));

// set views to /views folder
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

// initialize root directory to /views/index.ejs
app.get("/", function (req, res) {
    res.render("index");
});

app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.setHeader("Connection", "close");
    next();
});

// load routes
const apiRouter = require("./routes/api");
const viewRouter = require("./routes/view");
app.use("/api", apiRouter);
app.use("/view", viewRouter);


app.listen(port, () => console.log(`Listening on port ${port}! (localhost:${port})`))