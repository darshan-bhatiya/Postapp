const express = require("express");
const multer = require("multer");

const Post = require("../models/post");

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destnation: (req, file, cd) => {
        const inValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('invalid mime type');
        if (inValid) {
            error = null;
        }
        cd(error, "backend/images");
    },
    filename: (req,file, cd) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cd(null,name + '-'+Date.now()+'.'+ext);
    }
});

router.post("", multer({storage: storage}).single("image"),(req, res, next) => {
    console.log("req", req.body);
    const post = new Post({
        title :req.body.title,
        content :req.body.content
    }); 
    post.save().then(createdPost => {
        res.status(201).json({
            message : 'Data saved successfully',
            postId : createdPost._id
        });
    });
});

router.get("",(req, res, next) => {
    Post.find().then(document => {
        console.log(document);
        res.status(200).json({
            message: "api fatched successfuly",
            posts: document
        });    
    });
    // next();
});

router.get("/:id",(req,res,next) =>{
    Post.findById(req.params.id).then(post => {
        console.log(post);
        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({message: 'Post is not found!'});
        }
    });
});

router.delete("/:id",(req,res,next) => {
    Post.deleteOne({_id : req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({message : "post deleted!"});
    });
});

router.put("/:id", (req,res,next) => {
    const post = new Post({
        _id: req.body.id,
        title : req.body.title,
        content : req.body.content
    });
    Post.updateOne({_id: req.params.id},post).then(result => {
        console.log(result);
        res.status(200).json({message: "Updata successful!"}); 
    });
});

module.exports = router;