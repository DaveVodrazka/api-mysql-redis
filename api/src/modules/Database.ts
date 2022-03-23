import mysql from "mysql2";
import { MYSQL_IDS, MYSQL_TABLES } from "../constants.js";
import {
  Author,
  NullablePostData,
  NullablePostDataList,
  PostDataInsert,
  PostDataList,
  ResultInfo,
} from "../types.js";

export class Database {
  connection: mysql.Connection;

  constructor() {
    try {
      this.connection = mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB_NAME,
        port: parseInt(process.env.MYSQL_PORT, 10),
      });
    } catch (e) {
      console.log("Failed to connect to the databse");
      throw e;
    }
  }

  async addPost(postData: PostDataInsert): Promise<ResultInfo> {
    if (!this.validatePostData(postData)) {
      console.log("Failed to validate post data", postData);
      return;
    }

    const { title, firstParagraph, article, authorId } = postData;
    const query = `
        INSERT INTO ${MYSQL_TABLES.POSTS} (title, firstParagraph, article, authorId)
        VALUES ("${title}", "${firstParagraph}", "${article}", ${authorId});
    `;
    return this.insert(query);
  }

  async addAuthor(authorData: Author): Promise<ResultInfo> {
    const { firstName, lastName } = authorData;
    if (!firstName || !lastName) {
      console.log("Failed to validate author data", authorData);
      return;
    }

    const query = `
        INSERT INTO ${MYSQL_TABLES.AUTHORS} (firstName, lastName)
        VALUES ("${firstName}", "${lastName}");
    `;
    return this.insert(query);
  }

  private validatePostData(postData: PostDataInsert): boolean {
    const { title, firstParagraph, article, authorId } = postData;
    if (![title, firstParagraph, article, authorId].every(Boolean)) {
      return false;
    }
    if (![title, firstParagraph, article].every((x) => typeof x === "string")) {
      return false;
    }
    if (typeof authorId !== "number") {
      return false;
    }
    return true;
  }

  private async runQuery(query: string) {
    return new Promise((resolve) => {
      this.connection.query(query, (err, result) => {
        if (err) {
          console.error(err);
          resolve(null);
        }
        resolve(result);
      });
    });
  }

  private async retrieve(query: string): Promise<NullablePostDataList> {
    const result = await this.runQuery(query);

    if (this.validateResponse(result)) {
      return result as PostDataList;
    }
    return null;
  }

  private async insert(query: string): Promise<ResultInfo> {
    const result = await this.runQuery(query);
    console.log("result from insert", result);
    return result ? "success" : "failure";
  }

  private validateResponse(res: any): boolean {
    if (res && Array.isArray(res) && res.length) {
      return true;
    }
    return false;
  }

  async getPostById(id: number): Promise<NullablePostData> {
    const { POSTS: p, AUTHORS: a } = MYSQL_TABLES;
    const { POST_ID: pid, AUTHOR_ID: aid } = MYSQL_IDS;
    const query = `
      SELECT ${p}.title, ${p}.firstParagraph, ${p}.article, ${p}.created, ${a}.firstName, ${a}.lastName
      FROM ${p}
      LEFT JOIN ${a}
      ON ${p}.${aid}=${a}.${aid}
      WHERE ${p}.${pid}=${id};
    `;
    const res = await this.retrieve(query);
    return (res && res[0]) || null;
  }

  async getLastPosts(n: number): Promise<NullablePostDataList> {
    const { POSTS: p, AUTHORS: a } = MYSQL_TABLES;
    const { AUTHOR_ID: aid } = MYSQL_IDS;
    const query = `
      SELECT ${p}.title, ${p}.firstParagraph, ${p}.article, ${p}.created, ${a}.firstName, ${a}.lastName
      FROM ${p}
      LEFT JOIN ${a}
      ON ${p}.${aid}=${a}.${aid}
      ORDER BY created DESC LIMIT ${n};
    `;
    return await this.retrieve(query);
  }

  async getPostsRange(min: number, max: number): Promise<NullablePostDataList> {
    const { POSTS: p, AUTHORS: a } = MYSQL_TABLES;
    const { AUTHOR_ID: aid } = MYSQL_IDS;
    const query = `
      SELECT ${p}.title, ${p}.firstParagraph, ${p}.article, ${p}.created, ${a}.firstName, ${a}.lastName
      FROM ${p}
      LEFT JOIN ${a}
      ON ${p}.${aid}=${a}.${aid}
      ORDER BY created DESC LIMIT ${min}, ${max};
    `;
    return await this.retrieve(query);
  }
}
