import express from 'express';
import { getTags } from './tagService.js';

const tagRouter = express.Router();

tagRouter.get('/', async (req, res) => {
  const tableContent = await getTags();
  res.json({data: tableContent});
});

export default tagRouter;