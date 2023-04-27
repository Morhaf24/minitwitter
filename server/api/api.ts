import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import express, { Request, Response, Express } from 'express';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import { Database } from '../database'

const db = new Database();
dotenv.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET as string;

export class API {
  // Properties
  app: Express;
  // Constructor
  constructor(app: Express) {
    this.app = app;
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.get('/hello', this.sayHello.bind(this));
    this.app.post('/register', this.register.bind(this));
    this.app.post('/login', this.login.bind(this));
  }
  // Methods
  private async sayHello(req: Request, res: Response) {
    const result = await db.executeSQL('SELECT * FROM users');
    
    res.send(result);
  }

  private async register(req: Request, res: Response) {
    const { username, password, role } = req.body;
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  
    const existingUser = await db.executeSQL('SELECT name FROM users WHERE name = ?', [username]);
    if (existingUser.length > 0) {
      return res.status(400).send("Username already exists. Please choose a different username.");
    }
  
    const userRole = role || "C";
  
    try {
      await db.executeSQL(
        `INSERT INTO users (name, password, role) VALUES (?, ?, ?)`,
        [username, hashedPassword, userRole]
      );          
      res.send(`User ${username} registered successfully.`);
    } catch (error) {
      console.log(error);
      res.status(500).send('Failed to register user.');
    }
  }  
  
  private async login(req: Request, res: Response) {
    const { username, password } = req.body;
  
    try {
      const result = await db.executeSQL('SELECT name, password FROM users WHERE name = ?', [username]);
      if (result.length > 0) {
        const user = result[0];
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        if (user.password === hashedPassword) {
          const token = this.generateAccessToken({ username });
          res.cookie('jwt', token, { httpOnly: true });
          res.send('Login successful.');
        } else {
          res.send('Invalid username or password.');
        }
      } else {
        res.send('Invalid username or password.');
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('Failed to login.');
    }
  }
  
  private generateAccessToken(username: { username: string }) {
    return jwt.sign(username, TOKEN_SECRET, { expiresIn: '1800s' });
  }
}