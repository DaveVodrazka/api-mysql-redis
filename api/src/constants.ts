// REDIS
export const REDIS_PORT = 6379;
export const REDIS_HOST = "redis";
export const REDIS_ADDRESS = `redis://${REDIS_HOST}:${REDIS_PORT}`;

// API
export const API_PORT = 3000;
export const API_ROOT = "/api/v1/";

// MYSQL
export const MYSQL_PORT = 3306;
export const MYSQL_HOST = "db";
export const MYSQL_PASSWORD = "unbreakablepassword";
export const MYSQL_USER = "root";
export const MYSQL_DB_NAME = "mydb";
export const MYSQL_TABLES = {
  POSTS: "Posts",
  AUTHORS: "Authors",
};
export const MYSQL_IDS = {
  AUTHOR_ID: "authorId",
  POST_ID: "postId",
}
