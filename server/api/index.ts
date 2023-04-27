import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';

dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET as string;

const app = express();
app.use(express.json());
app.use(cookieParser());

interface User {
  username: string;
  password: string;
  role: String;
}

const users: User[] = [
  {
    username: 'admin',
    password: 'admin',
    role: 'A'
  },
  {
    username: 'user',
    password: 'password',
    role: 'C'
  }
];

function generateAccessToken(username: { username: string }): string {
  return jwt.sign(username, TOKEN_SECRET, { expiresIn: '1800s' });
}

app.post('/api/login', (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    const token = generateAccessToken({ username: user.username });
    res.cookie('jwt', token, { httpOnly: true });
    res.send('Login successful.');
  } else {
    res.send('Invalid username or password.');
  }
});

