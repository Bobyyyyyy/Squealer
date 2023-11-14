const express = require('express');
const postController = require('../controllers/postController')
const router = express.Router();


/* Post Methods */
router.post('/',postController.createPost);
router.post('/delete',postController.removePost);
router.get('/all',postController.getPosts);
router.put('/updateReaction', postController.updateReaction);
router.put('/deleteReaction', postController.deleteReaction);
router.get('/allDates', postController.getPostsDate);
router.get('/allReactionMonth', postController.getReactionLast30days)
router.get('/number',postController.postLength);


module.exports = router;