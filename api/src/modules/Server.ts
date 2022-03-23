import express, { Application } from "express";
import { graphqlHTTP } from "express-graphql";
import cors from "cors";

import { schema } from "./graphql/schema.js";
import { Resolver } from "./Resolver.js";

export class Server {
  app: Application;
  resolver: Resolver;
  #port: number;

  constructor() {
    this.#port = parseInt(process.env.API_PORT, 10);
    this.app = express();
    this.resolver = new Resolver();
  }

  async init() {
    await this.resolver.init();
    this.app.use(cors());
    this.app.use(
      "/graphql",
      graphqlHTTP({
        schema: schema,
        rootValue: this.resolver,
        graphiql: true,
      })
    );
    this.listen();
  }

  private listen() {
    this.app.listen(this.#port, () => {
      console.log(
        `API running on port ${this.#port}\nGQL playground accessible at http://localhost:${this.#port}/graphql`
      );
    });
  }
}
