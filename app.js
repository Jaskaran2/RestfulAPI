const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const https= require("https");
const mongoose=require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Setting up mongoose server
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema=new mongoose.Schema({
  title:String,
  content:String
});

const Article=mongoose.model("Article",articleSchema);



//......................................................................................................................

app.route("/articles")

.get(function(req,res){
  Article.find({},function(err,foundArticles){
    if(!err){
    res.send(foundArticles);
  }
  else
  {
    res.send(err);
  }
});
})

.post(function(req,res){
// console.log(req.body.title);
// console.log(req.body.content);

const newArticle=new Article({
  title:req.body.title,
  content:req.body.content
});
newArticle.save(function(err){
  if(!err){
    res.send("Successfully added new article");
  }
  else{
    res.send(err);
  }
});
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Delete successfull");
    }
    else{
    res.send(err);
    }
  });
});






//Local  host to run app locally
app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
