import express from "express";
import { getPostById, getPostCommentsById, addComment, deletePostById } from "./postSingleService.js";

const postSingleRouter = express.Router();

postSingleRouter.get("/:id", async (req, res) => {
  const postId = parseInt(req.params.id);
  const post = await getPostById(postId);
  res.json(post);
});

postSingleRouter.delete("/:id", async (req, res) => {
  const postId = parseInt(req.params.id);

  const success = await deletePostById(postId);
  if (success) {
    return res.sendStatus(204);
  } else {
    return res.status(500).json({ message: 'Failed to delete post' });
  } 
});

postSingleRouter.get("/comments/:id", async (req, res) => {
  const postId = parseInt(req.params.id);
  const comments = await getPostCommentsById(postId);
  res.json(comments);
})

postSingleRouter.post('/comments', async (req, res) => {
  const { postId, userId, content } = req.body;

  const success = await addComment({ postId, userId, content });
  if (success) {
    return res.status(201).json({ message: 'Comment added' });
  } else {
    return res.status(500).json({ message: 'Failed to add comment' });
  } 
});


export default postSingleRouter;
