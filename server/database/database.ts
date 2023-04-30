import mariadb from 'mariadb'
import { Pool } from 'mariadb'
import {  USER_TABLE, INSERT_USER, TWEET_TABLE, COMMENT_TABLE, LIKE_TABLE  } from './schema'

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
    await this.executeSQL(USER_TABLE)
    await this.executeSQL(INSERT_USER)
    await this.executeSQL(TWEET_TABLE)
    await this.executeSQL(COMMENT_TABLE)
    await this.executeSQL(LIKE_TABLE)
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
