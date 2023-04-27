import { Request, Response, Express } from 'express'
import { User } from '../database/index';

export class API {
  // Properties
  app: Express
  // Constructor
  constructor(app: Express) {
    this.app = app
    this.app.get('/hello', this.sayHello)
    this.app.post('/login', this.login)
  }
  // Methods
  private sayHello(req: Request, res: Response) {
    res.send('Hello There!')
  }

  private login(req: Request, res: Response) {
    const user = User;
    res.send(user);
  }
}