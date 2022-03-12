import express, { Application } from "express";
import { graphqlHTTP } from "express-graphql";
import cors from "cors";
import { performance } from "perf_hooks";

import { API_PORT } from "../constants.js";
import { schema } from "./graphql/schema.js";
import { Cache } from "./Cache.js";
import { Database } from "./Database.js";

export class Server {
  app: Application;
  cache: Cache;
  database: Database;

  constructor() {
    this.app = express();
    this.cache = new Cache();
    this.database = new Database();
  }

  async init() {
    this.app.use(cors());
    this.app.use(
      "/graphql",
      graphqlHTTP({
        schema: schema,
        rootValue: {
          post: this.getPost.bind(this),
          lastPosts: this.getLastPosts.bind(this),
          rangePosts: this.getPostsFromRange.bind(this),
          addPost: this.database.addPost.bind(this),
        },
        graphiql: true,
      })
    );
    await this.cache.init();
    this.listen();
  }

  private listen() {
    this.app.listen(API_PORT, () => {
      console.log(`API running on port ${API_PORT}`);
      console.log(
        `GQL playground accessible at http://localhost:${API_PORT}/graphql`
      );
    });
  }

  private async getPost(args) {
    const startTime = performance.now();
    const { id } = args;

    const cacheResponse = await this.cache.getSinglePost(id);

    if (cacheResponse) {
      console.log(
        `Sending post id: ${id} from cache - ${(
          performance.now() - startTime
        ).toFixed(2)}ms`
      );
      return cacheResponse;
    }

    const result = await this.database.getPostById(id);

    if (!result) {
      return null;
    }

    this.cache.setSinglePost(id, result);

    console.log(
      `Sending post id: ${id} from database - ${(
        performance.now() - startTime
      ).toFixed(2)}ms`
    );
    return result;
  }

  private async getLastPosts(args) {
    const startTime = performance.now();
    const { amount } = args;

    const cacheResponse = await this.cache.getRangeOfPosts(0, amount);

    if (cacheResponse) {
      console.log(
        `Sending last ${amount} posts from cache - ${(
          performance.now() - startTime
        ).toFixed(2)}ms`
      );
      return cacheResponse;
    }

    const result = await this.database.getLastPosts(amount);

    if (!result) {
      return null;
    }

    this.cache.setRangeOfPosts(0, amount, result);

    console.log(
      `Sending last ${amount} posts from database - ${(
        performance.now() - startTime
      ).toFixed(2)}ms`
    );
    return result;
  }

  private async getPostsFromRange(args) {
    const startTime = performance.now();
    const { first, last } = args;

    const cacheResponse = await this.cache.getRangeOfPosts(first, last);

    if (cacheResponse) {
      console.log(
        `Sending posts ${first}-${last} from cache - ${(
          performance.now() - startTime
        ).toFixed(2)}ms`
      );
      return cacheResponse;
    }

    const result = await this.database.getPostsRange(first, last);

    if (!result) {
      return null;
    }

    this.cache.setRangeOfPosts(first, last, result);

    console.log(
      `Sending posts ${first}-${last} from database - ${(
        performance.now() - startTime
      ).toFixed(2)}ms`
    );
    return result;
  }
}
