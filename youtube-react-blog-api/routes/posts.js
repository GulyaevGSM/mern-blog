const router = require('express').Router()
const User = require('../models/User')
const Post = require('../models/Post')
const bcrypt = require('bcrypt')

//CREATE
router.post('/', async (req, res) => {
    try {
        const newPost = await new Post(req.body)
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    } catch (error) {
        res.status(500).json(error)
    }
})



//UPDATE
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(post.username === req.body.username) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
                    $set: req.body
                }, {new: true})
                res.status(200).json('Updated post')
            } catch (e) {
                res.status(400).json(e)
            }       
        } else {
            res.status(401).json('you can update only your post')
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

//DELETE
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(post.username === req.body.username) {
            try {
                await post.delete()
                res.status(201).json('deleted post')
            } catch (error) {
                res.status(400).json(error)
            }
        } else {
            res.status(401).json('You can delete only your post')
        }
    } catch (e) {
        res.status(500).json(e)
    }
})




//GET POST

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        const {password, ...others} = post._doc
        
        res.status(200).json(others)
    } catch (error) {
        res.status(400).json(error)
    }
})

//GET ALL POSTS
router.get("/", async (req, res) => {
    const username = req.query.user;
    const catName = req.query.cat;
    try {
      let posts;
      if (username) {
        posts = await Post.find({ username });
      } else if (catName) {
        posts = await Post.find({
          categories: {
            $in: [catName],
          },
        });
      } else {
        posts = await Post.find();
      }
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  });



module.exports = router