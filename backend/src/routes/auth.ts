import bcrypt from 'bcrypt';
import express from 'express';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createUser, loginUser } from '../auth';
import { collections } from '../db';
import { ISanitizedUser } from '../models';

const router = express.Router();
export default router;

/**************************************************
 * Logging in a user
 **************************************************/

interface ILoginRequest {
  username: string;
  password: string;
}

interface ILoginResponse {
  user: ISanitizedUser;
  jwt: string;
}

router.post('/login', async (req, res) => {
  const data: ILoginRequest = req.body;

  if (!data.username || !data.password) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  try {
    const authData = await loginUser(data.username, data.password);

    if (!authData) {
      res.sendStatus(StatusCodes.BAD_REQUEST);
      return;
    }

    return res.json(authData as ILoginResponse);
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: err,
    });
  }
});

/**************************************************
 * Signing up a new user
 **************************************************/

interface ISignupRequest {
  fullName: string;
  username: string;
  password: string;
}

type ISignupRespones = ILoginResponse;

router.post('/signup', async (req, res) => {
  const data: ISignupRequest = req.body;

  if (!data.username || !data.password || !data.fullName) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  try {
    const authData = await createUser(data.username, data.password);

    if (!authData) {
      res.sendStatus(StatusCodes.BAD_REQUEST);
      return;
    }

    const avatarUrl = `https://avatars.dicebear.com/api/initials/${
      data.fullName + ' ' + authData.user._id
    }.svg`;

    await collections.users().updateOne(
      {
        _id: authData.user._id,
      },
      {
        $set: {
          fullName: data.fullName,
          avatarUrl,
        },
      }
    );

    const newUser = await collections.users().findOne({
      _id: authData.user._id,
    });

    if (!newUser) {
      res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
      return;
    }

    return res.json({
      user: newUser,
      jwt: authData.jwt,
    } as ISignupRespones);
  } catch (err: any) {
    console.error('Error creating user: ', err);
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: err,
    });
  }
});
