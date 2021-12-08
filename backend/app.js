const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const postsRoutes = require("./router/posts");
const userRouter = require("./router/user")

const app = express();

mongoose
    .connect("mongodb+srv://darshan1998:"
        + process.env.MONGO_ATLAS_PW +
        "@cluster0.phw0x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
)
.then(() => {
    console.log('Database connected successfuly');
})
.catch(()=>{
    console.log('Database connection faild!!');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept , Authorization"
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
app.use("/api/user",userRouter);

module.exports = app;