import mariadb from 'mariadb'
import { Pool } from 'mariadb'
import { COMMENT_TABLES, LIKES_TABLE, TWEETS_TABLE, USERS_TABLE, INSERT } from './schema'

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
    await this.executeSQL(USERS_TABLE);
    await this.executeSQL(COMMENT_TABLES);
    await this.executeSQL(LIKES_TABLE);
    await this.executeSQL(TWEETS_TABLE);
    await this.executeSQL(INSERT);
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
