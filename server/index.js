import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import appRouter from './routes/appController.js';
import userRouter from './routes/userController.js';
import postRouter from './routes/postController.js';
import tableRouter from './routes/tableController.js';
import postSingleRouter from './routes/postSingleController.js';
import tagRouter from './routes/tagController.js';
import summaryRouter from './routes/summaryController.js';
import petRouter from './routes/petController.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware setup
app.use(express.static("public")); // Serve static files from the 'public' directory
app.use(express.json()); // Parse incoming JSON payloads
app.use(cors());

// mount the router
app.use('/', appRouter);
app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/table', tableRouter);
app.use("/postSingle", postSingleRouter);
app.use('/tag', tagRouter);
app.use('/summary', summaryRouter);
app.use('/pet', petRouter);

// ----------------------------------------------------------
// Starting the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
