import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import testRouter from './routes/test';
import chatRouter from './routes/chat';
import { db } from './db';

const PORT = Number.parseInt(process.env['PORT'] || '5000');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/test', testRouter);
app.use('/chat', chatRouter);

app.listen(PORT, async () => {
  console.log(`Application started on port ${PORT}`);

  console.log('Connecting to database...');
  await db.command({ ping: 1 });
  console.log('Successfully connected to database');
});
