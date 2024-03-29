const express = require('express');
const postController = require('../controllers/postController')
const router = express.Router();


/* Post Methods */
router.post('/',postController.createPost);
router.get('/', postController.getHomePosts);
router.get('/anonymous', postController.getPostHomeAnonymous);
router.get('/user2watch', postController.getPostsByUser2watch);
router.get('/mention', postController.getPostFromMention);
router.get('/profile', postController.getPostsByProfile);
router.put('/destination',postController.addDestination);
router.post('/delete',postController.removePost);
router.get('/all',postController.getPosts);
router.put('/updateReaction', postController.updateReaction);
router.put('/deleteReaction', postController.deleteReaction);
router.get('/allDates', postController.getPostsDate);
router.get('/allReactionMonth', postController.getReactionLast30days)
router.get('/number',postController.postLength);
router.put('/position', postController.addPosition);

module.exports = router;