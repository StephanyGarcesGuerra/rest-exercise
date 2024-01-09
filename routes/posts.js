const express = require('express');
const posts = require('../data/posts');
const error = require('../utilities/error')

const router = express.Router();


//POSTS data- Get route

router
  .route("/")
  .get((req, res) => {
    res.json(posts);
  })
  .post((req, res) => {
    // Within the POST request route, we create a new
    // post with the data given by the client.
    if (req.body.userId && req.body.title && req.body.content) {
      const post = {
        id: posts[posts.length - 1].id + 1,
        userId: req.body.userId,
        title: req.body.title,
        content: req.body.content,
      };

      posts.push(post);
      res.json(posts[posts.length - 1]);
    } else next (error (400, "Insufficient Data" ));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const post = posts.find((p) => p.id == req.params.id);
    const links = [
        {
          href: `/${req.params.id}`,
          rel: "",
          type: "PATCH",
        },
        {
          href: `/${req.params.id}`,
          rel: "",
          type: "DELETE",
        },
      ];
  
      if (post) res.json({ post, links });
      else next();
    })
  .patch((req, res, next) => {
    // Within the PATCH request route, we allow the client
    // to make changes to an existing post in the database.
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        for (const key in req.body) {
          posts[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  })
  .delete((req, res, next) => {
    // The DELETE request route simply removes a resource.
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        posts.splice(i, 1);
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  });

module.exports= router;