import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import express, { Request, Response, Express } from 'express';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import { Database } from '../database'
import bodyParser from 'body-parser';

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
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.get('/hello', this.sayHello.bind(this));
    this.app.post('/register', this.register.bind(this));
    this.app.post('/login', this.login.bind(this));
    this.app.get('/tweets', this.getTweets.bind(this));
    this.app.post('/tweet', this.postTweet.bind(this));
    this.app.put('/tweet/:id', this.updateTweet.bind(this));
    this.app.delete('/tweet/:id', this.deleteTweet.bind(this));
    this.app.get('/comments', this.getComments.bind(this));
    this.app.post('/comment', this.postComment.bind(this));
    this.app.put('/comment/:id', this.updateComment.bind(this));
    this.app.delete('/comment/:id', this.deleteComment.bind(this));
    this.app.get('/user/:id', this.getUser.bind(this));
    this.app.put('/user/:id', this.updateUser.bind(this));
    this.app.delete('/user/:id', this.deleteUser.bind(this));
   //this.app.get('/whoAmI', this.whoAmI.bind(this));
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
    console.log(username, password);
    
    try {
      if (!username) {
        res.status(400).send('Username is missing.');        
        return;
      }
      const result = await db.executeSQL('SELECT name, password FROM users WHERE name = ?', [username]);
      if (result.length > 0) {
        const user = result[0];
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        if (user.password === hashedPassword) {
          const token = this.generateAccessToken({ username });
          res.cookie('jwt', token, { httpOnly: true });
          res.status(200).send('Login successful.');
        } else {
          res.status(400).send('Invalid username or password.');
        }
      } else {
        res.status(400).send('Invalid username or password.');
      }
    } catch (error) {
      res.status(500).send('Failed to login.');
    }
  }

  private generateAccessToken(username: { username: string }) {
    return jwt.sign(username, TOKEN_SECRET, { expiresIn: '1800s' });
  }

  private async getTweets(req: Request, res: Response) {
    const result = await db.executeSQL('SELECT content FROM tweets');
    if (result.length === 0) {
      res.status(200).send("There are no tweets yet");
    } else {
      res.status(200).send(result);
    }
  }

  private async postTweet(req: Request, res: Response) {
    const { user_id, content } = req.body;

    try {
      await db.executeSQL(
        `INSERT INTO tweets (user_id, content) VALUES (?, ?)`,
        [user_id, content]
      );
      res.send(`Thanks for your post.`);
    } catch (error) {
      console.log(error);
      res.status(500).send('Failed to post content.');
    }
  }

  private async updateTweet(req: Request, res: Response) {
    const id = req.params.id;
    const { user_id, content } = req.body;
  
    const result = await db.executeSQL('UPDATE tweets SET `user_id`= ?, `content`= ? WHERE id = ?', [user_id, content, id]);
  
    if (result.affectedRows === 0) {
      res.status(400).send("There are no tweets to update");
    } else {
      res.status(200).send(`The Tweet has been updated`);
    }
  } 

  private async deleteTweet(req: Request, res: Response) {
    const id = req.params.id;

    const result = await db.executeSQL('DELETE FROM comment WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      res.status(400).send("There are no comment to delete");
    } else {
      res.status(200).send(`The comment has been deleted`);
    }
  }
  
  private async getComments(req: Request, res: Response) {
    const result = await db.executeSQL('SELECT comment FROM comment');
    if (result.length === 0) {
      res.status(200).send("No Comments");
    } else {
      res.status(200).send(result);
    }
  }

  private async postComment(req: Request, res: Response) {
    const { user_id, comment, content } = req.body;

    try {
      await db.executeSQL(
        `INSERT INTO comment (user_id, comment, content) VALUES (?, ?, ?)`,
        [user_id, comment, content]
      );
      res.send(`Thanks for your comment.`);
    } catch (error) {
      console.log(error);
      res.status(500).send('Failed to comment.');
    }
  }

  private async updateComment(req: Request, res: Response) {
    const id = req.params.id;
    const { comment } = req.body;
  
    const result = await db.executeSQL('UPDATE comment SET `comment`= ? WHERE id = ?', [comment, id]);
  
    if (result.affectedRows === 0) {
      res.status(400).send("There are no comment to update");
    } else {
      res.status(200).send(`The comment with id ${id} has been updated`);
    }
  }

  private async deleteComment(req: Request, res: Response) {
    const id = req.params.id;

    const result = await db.executeSQL('DELETE FROM comment WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      res.status(400).send("There are no comment to delete");
    } else {
      res.status(200).send(`The comment has been deleted`);
    }
  }

  private async getUser(req: Request, res: Response) {
    const id = req.params.id;
    const result = await db.executeSQL('SELECT name FROM users WHERE id = ?', [id]);
    if (result.length === 0) {
      res.status(200).send("No User");
    } else {
      res.status(200).send(result);
    }
  }

  private async updateUser(req: Request, res: Response) {
    const id = req.params.id;
    const { oldPassword, name, password } = req.body;
  
    const result = await db.executeSQL('SELECT password FROM users WHERE id = ?', [id]);
    if (result.length === 0) {
      res.status(400).send("User not found");
      return false;
    }
  
    const storedPassword = result[0].password;

    if (!password || !oldPassword) {
      const updateResultWithoutPass = await db.executeSQL('UPDATE users SET name = ? WHERE id = ?', [ name, id]);
  
      if (updateResultWithoutPass.affectedRows === 0) {
        res.status(400).send("Update failed");
      } else {
        res.status(200).send(`The user has been updated`);
      }
      return;
    } 
    
    const hashedOldPassword = crypto.createHash('sha256').update(oldPassword).digest('hex');
  
    if (hashedOldPassword !== storedPassword) {
      res.status(400).send("Incorrect password");
      return false;
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    if (!name) {
      const updateResultWithoutName = await db.executeSQL('UPDATE users SET password = ? WHERE id = ?', [ hashedPassword, id]);
  
      if (updateResultWithoutName.affectedRows === 0) {
        res.status(400).send("Update failed");
      } else {
        res.status(200).send(`The user has been updated`);
      }
      return;
    }

    const updateResult = await db.executeSQL('UPDATE users SET name = ?, password = ? WHERE id = ?', [name, hashedPassword, id]);
  
    if (updateResult.affectedRows === 0) {
      res.status(400).send("Update failed");
    } else {
      res.status(200).send(`The user has been updated`);
    }
  }

  private async deleteUser(req: Request, res: Response) {
    const id = req.params.id;

    const result = await db.executeSQL('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      res.status(400).send("Try again later.");
    } else {
      res.status(200).send(`The user has been deleted`);
    }
  }
}