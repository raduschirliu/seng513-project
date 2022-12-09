import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { collections } from './db';
import { ISanitizedUser, IUser } from './models';
import { ObjectId } from 'mongodb';
import { Request } from 'express';

if (!process.env['JWT_SECRET']) {
  throw new Error('Must provide JWT_SECRET in environment!');
}

const SALT_ROUNDS = 10;
const BEARER_PREFIX = 'Bearer ';
const JWT_SECRET = process.env['JWT_SECRET']!;
const JWT_EXPIRATION = '2d';

export interface IJwtPayload extends jwt.JwtPayload {
  // User ID
  sub: string;
}

export interface IAuthData {
  user: ISanitizedUser;
  jwt: string;
}

function buildJwt(user: IUser) {
  const payload = { sub: user._id.toString() } as IJwtPayload;

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
}

/**
 * Attempt to login a user given a username/password combo
 * @param username The new user's username
 * @param password The new user's password
 * @returns Null if failed, or data about the logged in user
 */
export async function loginUser(
  username: string,
  password: string
): Promise<IAuthData | null> {
  const user = await collections.users().findOne({ username });

  if (!user || !user.passwordHash) {
    return Promise.reject('Invalid user');
  }

  const hashResult = await bcrypt.compare(password, user.passwordHash);
  if (!hashResult) {
    return Promise.reject('Invalid user');
  }

  const token = buildJwt(user);

  return Promise.resolve({
    user: sanitizeUser(user),
    jwt: token,
  });
}

/**
 * Create a new user given username and password. The only user fields that are populated are:
 * _id, username, password. Everything else will be an empty string
 * @param username The new user's username
 * @param password The new user's password
 * @returns Null if failed, or data about the newly created user
 */
export async function createUser(
  username: string,
  password: string
): Promise<IAuthData | null> {
  const existingUser = await collections.users().findOne({ username });

  if (existingUser) {
    return Promise.reject('Username already exists');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user: IUser = {
    _id: new ObjectId(),
    username,
    passwordHash,
    fullName: '',
    avatarUrl: '',
  };

  const result = await collections.users().insertOne(user);
  if (!result.acknowledged) {
    return Promise.reject('Failed to create user');
  }

  const token = buildJwt(user);

  return Promise.resolve({
    user: sanitizeUser(user),
    jwt: token,
  });
}

/**
 * Verify if the user is logged in, and return their userId if their auth is valid
 *
 * @param req The request sent to the server
 * @returns The userId of the logged in user, or null if there is no valid user
 */
export function verifyAuthToken(req: Request): string | null {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  if (!authHeader.startsWith(BEARER_PREFIX)) {
    return null;
  }

  const token = authHeader.substring(BEARER_PREFIX.length);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as IJwtPayload;

    if (!payload.sub) {
      console.error(
        'Got valid token with an empty sub field in payload',
        payload
      );
      return null;
    }

    return payload.sub;
  } catch {
    return null;
  }
}

/**
 * Strip sensitive info from a user object for returning to the client
 * @param user User to remove/strip info from
 * @returns A user object without any sensitive info attached (password hash, etc.)
 */
export function sanitizeUser(user: IUser): ISanitizedUser {
  const { passwordHash, ...stripped } = user;
  return stripped;
}
