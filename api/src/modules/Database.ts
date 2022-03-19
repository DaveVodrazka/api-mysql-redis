import mysql from "mysql2";
import {
  MYSQL_DB_NAME,
  MYSQL_HOST,
  MYSQL_IDS,
  MYSQL_PASSWORD,
  MYSQL_PORT,
  MYSQL_TABLES,
  MYSQL_USER,
} from "../constants.js";
import {
  NullablePostData,
  NullablePostDataList,
  PostDataInsert,
  PostDataList,
} from "../types.js";

export class Database {
  connection: mysql.Connection;

  constructor() {
    try {
      this.connection = mysql.createConnection({
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DB_NAME,
        port: MYSQL_PORT,
      });
    } catch (e) {
      console.log("Failed to connect to the databse");
      throw e;
    }
  }

  async addPost(postData: PostDataInsert) {
    if (!this.validatePostData(postData)) {
      console.log("Failed to validate post data", postData);
      return;
    }

    const { title, firstParagraph, article, authorId } = postData;
    const query = `
        INSERT INTO ${MYSQL_TABLES.POSTS} (title, firstParagraph, article, authorId)
        VALUES ("${title}", "${firstParagraph}", "${article}", ${authorId});
    `;
    this.runQuery(query).then((x) => {console.log(x)});
  }

  async addAuthor({ firstName, lastName }) {
    if (!firstName || !lastName) {
      console.log("Failed to validate author data", { firstName, lastName });
      return;
    }
  
    const query = `
        INSERT INTO ${MYSQL_TABLES.AUTHORS} (firstName, lastName)
        VALUES ("${firstName}", "${lastName}");
    `;
    this.runQuery(query).then((x) => {console.log(x)});
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

  private async retrieve(query: string) {
    const result = await this.runQuery(query);

    if (this.validateResponse(result)) {
      return result as PostDataList;
    }
    return null;
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
