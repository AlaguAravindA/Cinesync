const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const router = express.Router();

router.use(express.json());

const Comment = require('../models/comments');

router.post('/:imdbid', async (req, res) => {
    const { imdbid } = req.params;

    if (!req.body || !req.body.commentText) {
        return res.status(400).json({ message: 'Request body is missing or commentText is empty' });
    }

    const  commentText  = req.body.commentText;
    const userName = req.body.userName;

    


    try {
        // Create a new comment
        const newComment = new Comment({
            imdb_id: imdbid,
            userName:userName,
            comments: commentText,
            
        });

        // Save the new comment to the database
        const savedComment = await newComment.save();

        res.status(201).json(savedComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/getcomm/:imdb_id', async (req, res) => {
    const { imdb_id } = req.params;

    try {
        // Find comments for the specified IMDb ID
        const comments = await Comment.find({ imdb_id: imdb_id });

        if (!comments || comments.length === 0) {
            return res.status(404).json({ message: 'Comments not found for IMDb ID: ' + imdb_id });
        }

         res.status(200).json({
            comments: comments.map(comment => ({
                userName: comment.userName,
                commentText: comment.comments,
                replies: comment.replies,
                commentId:comment._id,
                createdAt: comment.createdAt,
                likes: comment.likes
            })),
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.post('/addreply/:commentId',async(req,res)=>{
    const commentId = req.params.commentId;
    const {username , replyText} = req.body;
    try {
        // Find the comment with the given commentId
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found for commentId: ' + commentId });
        }

        // Create a new reply
        const newReply = {
            username: username,
            replyText: replyText,
            commentId:commentId
        };

        // Add the new reply to the comment's replies array
        comment.replies.push(newReply);

        // Save the updated comment
        const updatedComment = await comment.save();

        res.status(201).json(updatedComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

    
});
router.post('/addlike/:commentId', async (req, res) => {
    const commentId = req.params.commentId;

    try {
        // Find the comment with the given commentId
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found for commentId: ' + commentId });
        }

        // Increment the likes count for the comment
        comment.likes = (comment.likes || 0) + 1;

        // Save the updated comment
        const updatedComment = await comment.save();

        res.status(201).json({ likes: updatedComment.likes }); // Return the updated likes count
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/getlikes/:commentId', async (req, res) => {
    const commentId = req.params.commentId;

    try {
        // Find the comment with the given commentId
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found for commentId: ' + commentId });
        }

        res.status(200).json({ likes: comment.likes }); // Return the current likes count
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
