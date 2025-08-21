import express from 'express';
import { getMostLikedUsers, getPostsByPetForUser, getUsersCommentedOnAll } from './summaryService.js';

const summaryRouter = express.Router();

summaryRouter.get('/mostLiked', async (req, res) => {
  const tableContent = await getMostLikedUsers();
  res.json({data: tableContent});
});

summaryRouter.get('/commentedOnAllPosts/:username', async (req, res) => {
  const username = req.params.username
  const tableContent = await getUsersCommentedOnAll(username);
  res.json({data: tableContent});
});

summaryRouter.get('/postsByPetForUser/:username', async (req, res) => {
  const username = req.params.username
  const tableContent = await getPostsByPetForUser(username);
  res.json({data: tableContent});
});




export default summaryRouter;