const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser : true});

const articleSchema = {
  title : String,
  body : String
};

const Article = mongoose.model('Article', articleSchema);

app.get('/articles', (req, res) => {
  Article.find({}, (err, foundArticles) => {
    if (!err){
      res.send(foundArticles);
    } else {
      res.send(err);
    }

  })
});

app.post('/articles', (req, res) => {
  const title = req.body.title;
  const content = req.body.content;

  const newArticle = new Article({
    title : title,
    body : content
  });
  newArticle.save((err) => {
    if (!err) {
      res.send("Successfully posted request");
    } else {
      res.send(err);
    }
  })

})


app.delete('/articles', (req, res) => {
  Article.deleteMany({}, (err) => {
    if (!err) {
      res.send("Successfully deleted all items");
    } else {
      res.send(err);
    }
  })

})


app.route('/articles/:articleTitle')

.get( (req, res) => {

  const articleTitle = req.params.articleTitle;

  Article.findOne(
    {title : articleTitle},
    (err, foundArticle) => {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No such article found");
      }
    }

  );

})

.put((req, res) => {
  const articleTitle = req.params.articleTitle;
  Article.update(
    {title : articleTitle},
    {title : req.body.title, content : req.body.content},
    {overwrite : true},
    (err) => {
      if (!err) {
        res.send("Successfully updates article");
      }
    }

  )
})

.patch((req, res) => {
  Article.update(
    {title : req.params.articleTitle},
    {$set : req.body},
    (err) => {
      if (!err) {
        res.send("Successfully patched article!")
      } else {
        res.send(err)
      }
    }

  )
})

.delete((req, res) => {
  Article.deleteOne(
    {title : req.params.articleTitle},
    (err) => {
      if (!err) {
        res.send("Successfully deleted article!");
      } else {
        res.send(err);
      }
    }
  )
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
