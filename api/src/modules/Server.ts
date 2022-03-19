import express, { Application } from "express";
import { graphqlHTTP } from "express-graphql";
import cors from "cors";

import { API_PORT } from "../constants.js";
import { schema } from "./graphql/schema.js";
import { Resolver } from "./Resolver.js";

export class Server {
  app: Application;
  resolver: Resolver;

  constructor() {
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
    this.app.listen(API_PORT, () => {
      console.log(
        `API running on port ${API_PORT}\nGQL playground accessible at http://localhost:${API_PORT}/graphql`
      );
    });
  }
}
