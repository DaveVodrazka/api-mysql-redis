import { createClient } from "redis";

import { REDIS_ADDRESS } from "../constants.js";
import { CacheConfig, NullablePostData, NullablePostDataList } from "../types.js";

export class Cache {
  client: any;
  private conf: CacheConfig;

  constructor(conf: CacheConfig = {}) {
    this.conf = {
      singlePostExpiry: 30,
      multiPostExpiry: 5,
    };
    Object.assign(this.conf, conf);
    this.client = createClient({
      url: REDIS_ADDRESS,
    });
    this.setEvents();
  }

  private setEvents() {
    this.client.on("error", (err) => console.error("Redis Client Error", err));
  }

  async init() {
    await this.client.connect();
  }

  private setItem(key, value, expire) {
    if (!value) {
      return;
    }
    this.client.set(key, JSON.stringify(value), { EX: expire });
  }

  private getSingleKey(n) {
    return `SNGL${n}`;
  }

  private getRangeKey(a, b) {
    return `MLT${a}-${b}`;
  }

  setSinglePost(id: number, value: any): void {
    this.setItem(this.getSingleKey(id), JSON.stringify(value), this.conf.singlePostExpiry);
  }

  setRangeOfPosts(a: number, b: number, value: any):void {
    this.setItem(this.getRangeKey(a, b), JSON.stringify(value), this.conf.multiPostExpiry);
  }

  async getSinglePost(n: number): Promise<NullablePostData> {
    const response = await this.getItem(this.getSingleKey(n));
    try {
      return JSON.parse(response);
    } catch {
      return null;
    }
  }

  async getRangeOfPosts(a:number, b:number): Promise<NullablePostDataList> {
    const response = await this.getItem(this.getRangeKey(a, b));
    try {
      return JSON.parse(response);
    } catch {
      return null;
    }
  }

  private async getItem(key) {
    const res = await this.client.get(key);
    if (res === "nil") {
      return null;
    }
    try {
      return JSON.parse(res);
    } catch {
      return null;
    }
  }
}
