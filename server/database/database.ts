import mariadb from 'mariadb'
import { Pool } from 'mariadb'
import { COMMENT_TABLES, LIKES_TABLE, TWEETS_TABLE, USERS_TABLE, INSERT, ALTER_COMMENTS, ALTER_LIKES, ALTER_TWEETS, ALTER_USERS, MODIFY_COMMENT, MODIFY_LIKES, MODIFY_TWEETS, MODIFY_USERS, CONSTRAINT_COMMENT, CONSTRAINT_LIKES, CONSTRAINT_TWEETS } from './schema'

export class Database {
  // Properties
  private _pool: Pool
  // Constructor
  constructor() {
    this._pool = mariadb.createPool({
      database: process.env.DB_NAME || 'minitwitter',
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'minitwitter',
      password: process.env.DB_PASSWORD || 'supersecret123',
      connectionLimit: 5,
    })
    this.initializeDBSchema()
  }
  // Methods
  private initializeDBSchema = async () => {
    console.log('Initializing DB schema...')
    await this.executeSQL(COMMENT_TABLES)
    await this.executeSQL(LIKES_TABLE)
    await this.executeSQL(TWEETS_TABLE)
    await this.executeSQL(USERS_TABLE)
    await this.executeSQL(INSERT)
    await this.executeSQL(ALTER_COMMENTS)
    await this.executeSQL(ALTER_LIKES)
    await this.executeSQL(ALTER_TWEETS)
    await this.executeSQL(ALTER_USERS)
    await this.executeSQL(MODIFY_COMMENT)
    await this.executeSQL(MODIFY_LIKES)
    await this.executeSQL(MODIFY_TWEETS)
    await this.executeSQL(MODIFY_USERS)
    await this.executeSQL(CONSTRAINT_COMMENT)
    await this.executeSQL(CONSTRAINT_LIKES)
    await this.executeSQL(CONSTRAINT_TWEETS)
  }

  public executeSQL = async (query: string, values?: any[]) => {
    try {
      const conn = await this._pool.getConnection()
      const res = await conn.query(query, values)
      conn.end()
      return res
    } catch (err) {
      console.log(err)
    }
  }
}
