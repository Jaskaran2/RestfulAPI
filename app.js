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



//Targeting all article........................................................................................

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

//Targeting specific article........................................................................................

app.route("/articles/:articleTitle")

.get(function(req,res){
  const articleTitle=req.params.articleTitle;
  Article.findOne({title:articleTitle},function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }
    else{
      res.send("No article at the moment");
    }
  });
})

.put(function(req,res){
  Article.update(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated");
      }
    }
  );
})

.patch(function(req,res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("successfully updated");
      }
      else{
        res.send(err);
      }
    }
  );
})

.delete(function(req,res){
  Article.deleteOne({title:req.params.articleTitle},
  function(err){
    if(!err){
      res.send("Successfully deteted the requested item");
    }
    else{
      res.send(err);
    }
  });
});
//Local  host to run app locally...........................................................................................
app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
