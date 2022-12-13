import express from 'express';
import { Request, Response } from 'express';
import { verifyAuthToken } from '../auth';

const router = express.Router();
export default router;

interface IPingRequest {
  message: string;
}

// Test to see if the server works
router.post('/ping', (req, res) => {
  const data: IPingRequest = req.body;

  res.json({
    message: 'pong',
    yourMessage: data.message,
  });
});

// Replies with test names
router.get('/list-users', (req, res) => {
  const data: IPingRequest = req.body;

  res.json(
    [{'Alex Zegras':0}, {'Blaire Yankapov':1}, {'Clive Xavier':2}, {'Danielle Washington':3}, {'Evan Veilleux':4}, {'Francine Underhill':5}]
    );
});

// Test to see if the user is authenticated or not
router.get('/authenticated', (req, res) => {
  const userId = verifyAuthToken(req);

  if (!userId) {
    res.json({
      status: 'Not authenticated',
    });
  } else {
    res.json({
      status: 'Authenticated with UserID: ' + userId,
    });
  }
});

