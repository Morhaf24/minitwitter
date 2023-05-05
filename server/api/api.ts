import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import express, { Request, Response, Express } from 'express';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import { Database } from '../database'
import bodyParser from 'body-parser';
import { send } from 'vite';

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
    this.app.post('/register', this.register.bind(this));
    this.app.post('/login', this.login.bind(this));
    this.app.post('/logout', this.logout.bind(this));
    this.app.get('/tweets', this.getTweets.bind(this));
    this.app.get('/myTweets', this.getMyTweets.bind(this));
    this.app.post('/tweet', this.postTweet.bind(this));
    this.app.put('/tweet/:id', this.updateTweet.bind(this));
    this.app.delete('/tweet/:id', this.deleteTweet.bind(this));
    this.app.get('/comments', this.getComments.bind(this));
    this.app.post('/comment/:content', this.postComment.bind(this));
    this.app.put('/comment/:id', this.updateComment.bind(this));
    this.app.delete('/comment/:id', this.deleteComment.bind(this));
    this.app.get('/users', this.getUsers.bind(this));
    this.app.put('/user', this.updateUser.bind(this));
    this.app.put('/user/:id', this.updateUserByAdmin.bind(this));
    this.app.delete('/user/:id', this.deleteUser.bind(this));
    this.app.put('/like/:tweet_id', this.likeTweet.bind(this));
    this.app.put('/dislike/:tweet_id', this.dislikeTweet.bind(this));
    this.app.get('/whoAmI', this.whoAmI.bind(this));
    this.app.get('/role', this.getRole.bind(this));
  }
  // Methods
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
    return jwt.sign(username, TOKEN_SECRET, { expiresIn: '18000s' });
  }

  private async logout(req: Request, res: Response) {
    res.clearCookie('jwt');
    res.status(200).send('Logout successful.');
  }

  public authentication(req: Request, res: Response) {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json('Unauthorized');
      return false;
    }
    return true;
  }

  public whoAmI(req: Request, res: Response) {
    const token = req.cookies.jwt;
    if (!this.authentication(req, res)) {
      return false;
    }

    try {
      const decodedToken = jwt.verify(token, TOKEN_SECRET) as { username: string };
      const username = decodedToken.username;

      return username;
    } catch (error) {
      res.status(401).send('Unauthorized');
    }
  }

  public async getRole(req: Request, res: Response) {
    const token = req.cookies.jwt;
    if (!this.authentication(req, res)) {
      return;
    }
    try {
      const decodedToken = jwt.verify(token, TOKEN_SECRET) as { username: string };
      const username = decodedToken.username;

      const result = await db.executeSQL('SELECT role FROM users WHERE name = ?', [username]);

      let role = result[0].role;
      if (role === "A" || role === "M") {
        return true;
      }

      res.status(403).send(role);
      return false;
    } catch (error) {
      res.status(401).send('Unauthorized');
    }
  }

  public async getAdminRole(req: Request, res: Response) {
    const token = req.cookies.jwt;
    if (!this.authentication(req, res)) {
      return;
    }
    try {
      const decodedToken = jwt.verify(token, TOKEN_SECRET) as { username: string };
      const username = decodedToken.username;

      const result = await db.executeSQL('SELECT role FROM users WHERE name = ?', [username]);

      let role = result[0].role;
      if (role === "A") {
        return true;
      }

      res.status(403).send(role);
      return false;
    } catch (error) {
      res.status(401).send('Unauthorized');
    }
  }

  private async getTweets(req: Request, res: Response) {
    if (!this.authentication(req, res)) {
      return;
    }

    const result = await db.executeSQL(`
      SELECT tweets.id, tweets.content, users.name,
      COUNT(DISTINCT likes.id) AS likes,
      COUNT(DISTINCT dislikes.tweet_id) AS dislikes,
      GROUP_CONCAT(CONCAT(' ', users_comment.name, ': ', comment.comment) ORDER BY comment.content SEPARATOR '\n') AS comments
      FROM tweets
      LEFT JOIN users ON tweets.user_id = users.id
      LEFT JOIN likes ON tweets.id = likes.tweet_id AND likes.likes = 1
      LEFT JOIN likes AS dislikes ON tweets.id = dislikes.tweet_id AND dislikes.likes = 0
      LEFT JOIN comment ON tweets.id = comment.content
      LEFT JOIN users AS users_comment ON comment.user_id = users_comment.id
      GROUP BY tweets.id
      ORDER BY tweets.id DESC;
    `);
    
    if (result.length === 0) {
      res.status(204).send("There are no tweets yet");
    } else {
      res.status(200).send(result);
    }
  }

  private async getMyTweets(req: Request, res: Response) {
    if (!this.authentication(req, res)) {
      return false;
    }
    const name = this.whoAmI(req, res);

    const myId = await db.executeSQL('SELECT id FROM users WHERE name = ?', [name]);


    const result = await db.executeSQL(`
      SELECT tweets.id, tweets.content, users.name,
      COUNT(DISTINCT likes.id) AS likes,
      COUNT(DISTINCT dislike.id) AS dislike,
      (SELECT GROUP_CONCAT(CONCAT(' ', users_comment.name, ': ', comment.comment))
      FROM comment
      LEFT JOIN users AS users_comment ON comment.user_id = users_comment.id
      WHERE comment.content = tweets.id) AS comments
      FROM tweets
      LEFT JOIN users ON tweets.user_id = users.id
      LEFT JOIN likes ON tweets.id = likes.tweet_id
      LEFT JOIN likes AS dislike ON tweets.id = dislike.tweet_id AND dislike.dislike = 1
      WHERE tweets.user_id = ?
      GROUP BY tweets.id
      ORDER BY tweets.id DESC;
    `, [myId[0].id]);

    if (result.length === 0) {
      res.status(204).send("There are no tweets yet");
    } else {
      res.status(200).send(result);
    }
  }

  private async postTweet(req: Request, res: Response) {
    if (!this.authentication(req, res)) {
      return;
    }
    const name = this.whoAmI(req, res);
    const user_id = await db.executeSQL(`SELECT id FROM users WHERE name = ?`, [name]);
    const { content } = req.body;

    try {
      await db.executeSQL(`INSERT INTO tweets (user_id, content) VALUES (?, ?)`, [user_id[0].id, content]);
      res.send(`Thanks for your post.`);
    } catch (error) {
      console.log(error);
      res.status(500).send('Failed to post content.');
    }
  }

  private async updateTweet(req: Request, res: Response) {
    if (!this.authentication(req, res)) {
      return;
    }
    const id = req.params.id;
    const { content } = req.body;

    const name = this.whoAmI(req, res);
    const myRole = await db.executeSQL(`SELECT id FROM users WHERE name = ?`, [name]);
    const tweetId = await db.executeSQL(`SELECT user_id FROM tweets WHERE id = ?`, [id]);

    if (myRole.length === 0 || tweetId.length === 0) {
      return res.status(400).send("Invalid tweet ID or user");
    }

    if (myRole[0].id !== tweetId[0].user_id) {
      const role = await this.getRole(req, res);
      if (!role) {
        return;
      }
    }

    const result = await db.executeSQL('UPDATE tweets SET `content`= ? WHERE id = ?', [content, id]);

    if (result.affectedRows === 0) {
      return res.status(400).send("There are no tweets to update");
    }

    return res.status(200).send(`The Tweet has been updated`);
  }

  private async deleteTweet(req: Request, res: Response) {
    if (!this.authentication(req, res)) {
      return;
    }
    const id = req.params.id;

    const name = this.whoAmI(req, res);
    const myRole = await db.executeSQL(`SELECT id FROM users WHERE name = ?`, [name]);
    const tweetId = await db.executeSQL(`SELECT user_id FROM tweets WHERE id = ?`, [id]);

    if (myRole.length === 0 || tweetId.length === 0) {
      return res.status(400).send("Invalid tweet ID or user");
    }

    if (myRole[0].id !== tweetId[0].user_id) {
      const role = await this.getRole(req, res);
      if (!role) {
        return;
      }
    }

    const result = await db.executeSQL('DELETE FROM tweets WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      res.status(400).send("There are no tweet to delete");
    } else {
      res.status(200).send(`The tweet has been deleted`);
    }
  }

  private async getComments(req: Request, res: Response) {
    if (!this.authentication(req, res)) {
      return;
    }
    const result = await db.executeSQL('SELECT comment FROM comment');
    if (result.length === 0) {
      res.status(200).send("No Comments");
    } else {
      res.status(200).send(result);
    }
  }

  private async postComment(req: Request, res: Response) {
    if (!this.authentication(req, res)) {
      return;
    }
    const name = this.whoAmI(req, res);
    const user_id = await db.executeSQL(`SELECT id FROM users WHERE name = ?`, [name]);
    const { comment } = req.body;
    const content = req.params.content;

    try {
      await db.executeSQL(`INSERT INTO comment (user_id, comment, content) VALUES (?, ?, ?)`, [user_id[0].id, comment, content]);
      res.status(200).send(`Thanks for your comment.`);
    } catch (error) {
      res.status(400).send('Failed to comment.');
    }
  }

  private async updateComment(req: Request, res: Response) {
    if (!this.authentication(req, res)) {
      return;
    }
    const id = req.params.id;
    const { comment } = req.body;

    const name = this.whoAmI(req, res);
    const myRole = await db.executeSQL(`SELECT id FROM users WHERE name = ?`, [name]);
    const commentId = await db.executeSQL(`SELECT user_id FROM comment WHERE id = ?`, [id]);

    if (myRole.length === 0 || commentId.length === 0) {
      return res.status(400).send("Invalid tweet ID or user");
    }

    if (myRole[0].id !== commentId[0].user_id) {
      const role = await this.getRole(req, res);
      if (!role) {
        return;
      }
    }

    const result = await db.executeSQL('UPDATE comment SET `comment`= ? WHERE id = ?', [comment, id]);

    if (result.affectedRows === 0) {
      res.status(400).send("There are no comment to update");
    } else {
      res.status(200).send(`The comment with id ${id} has been updated`);
    }
  }

  private async deleteComment(req: Request, res: Response) {
    if (!this.authentication(req, res)) {
      return;
    }
    const id = req.params.id;

    const name = this.whoAmI(req, res);
    const myRole = await db.executeSQL(`SELECT id FROM users WHERE name = ?`, [name]);
    const commentId = await db.executeSQL(`SELECT user_id FROM comment WHERE id = ?`, [id]);

    if (myRole.length === 0 || commentId.length === 0) {
      return res.status(400).send("Invalid tweet ID or user");
    }

    if (myRole[0].id !== commentId[0].user_id) {
      const role = await this.getRole(req, res);
      if (!role) {
        return;
      }
    }

    const result = await db.executeSQL('DELETE FROM comment WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      res.status(400).send("There are no comment to delete");
    } else {
      res.status(200).send(`The comment has been deleted`);
    }
  }

  private async getUsers(req: Request, res: Response) {
    if (!this.authentication(req, res)) {
      return;
    }

    const name = this.whoAmI(req, res);
    const myRole = await db.executeSQL(`SELECT id FROM users WHERE name = ?`, [name]);
    const adminId = await db.executeSQL(`SELECT id FROM users WHERE id = ?`, [1]);

    if (myRole.length === 0 || adminId.length === 0) {
      return res.status(400).send("Invalid tweet ID or user");
    }

    if (myRole[0].id !== adminId[0].id) {
      const role = await this.getAdminRole(req, res);
      if (!role) {
        return;
      }
    }

    const result = await db.executeSQL('SELECT * FROM users');
    if (result.length === 0) {
      res.status(400).send("No User");
    } else {
      res.status(200).json(result);
    }
  }

  private async updateUser(req: Request, res: Response) {
    if (!this.authentication(req, res)) {
      return;
    }

    const authName = this.whoAmI(req, res);

    const myId = await db.executeSQL('SELECT id FROM users WHERE name = ?', [authName]);

    const { oldPassword, name, password } = req.body;

    const result = await db.executeSQL('SELECT password FROM users WHERE id = ?', [myId[0].id]);
    if (result.length === 0) {
      res.status(400).send("User not found");
      return false;
    }

    const storedPassword = result[0].password;

    if (!password || !oldPassword) {
      const updateResultWithoutPass = await db.executeSQL('UPDATE users SET name = ? WHERE id = ?', [name, myId[0].id]);

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
      const updateResultWithoutName = await db.executeSQL('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, myId[0].id]);

      if (updateResultWithoutName.affectedRows === 0) {
        res.status(400).send("Update failed");
      } else {
        res.status(200).send(`The user has been updated`);
      }
      return;
    }

    const updateResult = await db.executeSQL('UPDATE users SET name = ?, password = ? WHERE id = ?', [name, hashedPassword, myId[0].id]);

    if (updateResult.affectedRows === 0) {
      res.status(400).send("Update failed");
    } else {
      res.status(200).send(`The user has been updated`);
    }
  }

  private async updateUserByAdmin(req: Request, res: Response) {
    if (!this.authentication(req, res)) {
      return;
    }

    const id = req.params.id;

    const { oldPassword, name, password } = req.body;

    const result = await db.executeSQL('SELECT password FROM users WHERE id = ?', [id]);
    if (result.length === 0) {
      res.status(400).send("User not found");
      return false;
    }

    const storedPassword = result[0].password;

    if (!password || !oldPassword) {
      const updateResultWithoutPass = await db.executeSQL('UPDATE users SET name = ? WHERE id = ?', [name, id]);

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
      const updateResultWithoutName = await db.executeSQL('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);

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
    if (!this.authentication(req, res)) {
      return;
    }
    const id = req.params.id;

    const result = await db.executeSQL('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      res.status(400).send("Try again later.");
    } else {
      res.status(200).send(`The user has been deleted`);
    }
  }

  private async likeTweet(req: Request, res: Response) {
    if (!this.authentication(req, res)) {
      return;
    }

    const name = this.whoAmI(req, res);
    const tweet_id = req.params.tweet_id;
    const getUserId = await db.executeSQL('SELECT id FROM users WHERE name = ?', [name]);
    const user_id = getUserId[0].id;

    const check = await db.executeSQL('SELECT id, likes FROM likes WHERE tweet_id = ? AND user_id = ?', [tweet_id, user_id]);
    
    if (check.length === 0) {
      const likes = 1;
      const newLike = await db.executeSQL(`INSERT INTO likes (tweet_id, likes, dislike, user_id) VALUES (?, ?, ?, ?)`, [tweet_id, likes, 0, user_id]);
      if (newLike) {
        res.status(200).send('New like has been created');
        return true;
      }
    } else {
      const like_id = check[0].id;
      const like_count = check[0].likes;
      
      if (like_count === 1) {
        const result = await db.executeSQL('DELETE FROM likes WHERE id = ?', [like_id]);
        if (result) {
          res.status(200).send('Tweet like removed successfully');
          return true;
        }
      } else {
        const result = await db.executeSQL('UPDATE likes SET likes = ? WHERE id = ?', [like_count - 1, like_id]);
        if (result) {
          res.status(200).send('Tweet like removed successfully');
          return true;
        }
      }
    }
    res.status(400).send('Try again');
  }

  private async dislikeTweet(req: Request, res: Response) {
    if (!this.authentication(req, res)) {
      return;
    }
  
    const name = this.whoAmI(req, res);
    const tweet_id = req.params.tweet_id;
    const getUserId = await db.executeSQL('SELECT id FROM users WHERE name = ?', [name]);
    const user_id = getUserId[0].id;
  
    const check = await db.executeSQL('SELECT id, dislike FROM likes WHERE tweet_id = ? AND user_id = ?', [tweet_id, user_id]);

    if (check.length === 0) {
      const dislikes = 1;
      const newDislike = await db.executeSQL(`INSERT INTO likes (tweet_id, likes, dislike, user_id) VALUES (?, ?, ?, ?)`, [tweet_id, 0, dislikes, user_id]);
      if (newDislike) {
        res.status(200).send('New dislike has been created');
        return true;
      }
    } else {
      const dislike_id = check[0].id;
      const dislike_count = check[0].dislike;

      if (dislike_count === 1) {
        const result = await db.executeSQL('DELETE FROM likes WHERE id = ?', [dislike_id]);
        if (result) {
          res.status(200).send('Tweet dislike removed successfully');
          return true;
        }
      } else {
        const result = await db.executeSQL('UPDATE likes SET dislike = ? WHERE id = ?', [dislike_count - 1, dislike_id]);
        if (result) {
          res.status(200).send('Tweet has been disliked');
          return true;
        }
      }
    }
    res.status(400).send('Try again');
  }  
}