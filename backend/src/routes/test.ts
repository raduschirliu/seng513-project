import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

interface IPingRequest {
  message: string;
}

router.post('/ping', (req, res) => {
  const data: IPingRequest = req.body;

  res.json({
    message: 'pong',
    yourMessage: data.message,
  });
});

export default router;
