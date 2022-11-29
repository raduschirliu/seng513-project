import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import testRouter from './routes/test';

const PORT = Number.parseInt(process.env['PORT'] || '5000');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/test', testRouter);

app.listen(PORT, () => {
  console.log(`Application started on port ${PORT}`);
});
