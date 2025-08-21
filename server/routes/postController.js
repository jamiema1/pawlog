import express from 'express';
import { getPostsSummary } from './postService.js';

const postRouter = express.Router();

postRouter.get('/:query', async (req, res) => {
	const query = JSON.parse(req.params.query)
	const tableContent = await getPostsSummary(
		query.username,
		query.created_at,
		query.minlikes
	);
	res.json({data: tableContent});
});




export default postRouter;