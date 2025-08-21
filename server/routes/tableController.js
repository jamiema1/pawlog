import express from 'express';
import { getAttributes, getTables, getTuples } from './tableService.js';

const tableRouter = express.Router();

tableRouter.get('/', async (req, res) => {
  const tableContent = await getTables();
  res.json({data: tableContent.flat()});
});

tableRouter.get('/:name', async (req, res) => {
  const tableContent = await getAttributes(req.params.name);
  res.json({data: tableContent.flat()});
});

tableRouter.get('/:name/:attributes', async (req, res) => {
  const tableName = req.params.name
  const attributes = req.params.attributes.split(',')
  const tableContent = await getTuples(tableName, attributes);
  res.json({data: tableContent});
});

export default tableRouter;