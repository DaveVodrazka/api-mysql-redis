import { performance } from "perf_hooks";

import { Cache } from "./Cache.js";
import { Database } from "./Database.js";

export class Resolver {
  cache: Cache
  database: Database

  constructor() {
    this.cache = new Cache();
    this.database = new Database();
  }

  async init() {
    await this.cache.init();
  }

  async post(args) {
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

  async lastPosts(args) {
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

  async rangePosts(args) {
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

  async addPost(args) {
    return await this.database.addPost(args);
  }

  async addAuthor(args) {
    const res = await this.database.addAuthor(args);
    console.log(res);
    return res;
  }
}
