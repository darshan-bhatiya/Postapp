const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const postsRoutes = require("./router/posts");

const app = express();

mongoose.connect("mongodb+srv://darshan1998:je7P5L5v6WhkLXik@cluster0.phw0x.mongodb.net/node-angular?retryWrites=true&w=majority")
.then(() => {
    console.log('Database connected successfuly');
})
.catch(()=>{
    console.log('Database connection faild!!');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

// app.use((req, res, next) => {
//     res.send("this is response form express");
// });

app.use("/api/posts",postsRoutes);

module.exports = app;