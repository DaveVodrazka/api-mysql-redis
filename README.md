# API with MySQL and Redis

This project consists of several microservices ran by *docker compose*.

## API

Runs in *Nodejs*, is written in *TypeScript*. Core technologies are [express](https://github.com/expressjs/express), [mysql2](https://github.com/sidorares/node-mysql2), [redis](https://github.com/redis/node-redis) and [graphql](https://github.com/graphql/graphql-js) NPM packages.

## DB

MySQL running in a Docker container. Schema is stored in the `schema.sql` file, along with base data, that will be uploaded if the container is deleted.

## Redis

There is no folder for Redis, only the [official Redis Docker image](https://hub.docker.com/_/redis) is used. Communication is done via [Redis NPM package](https://github.com/redis/node-redis).

## Client

Currently does not do anything. Will be a React single page app using Apollo to communicate with the API.

## CDN

Nginx serving static images, it works but nothing is currently connected to it.

## Admin

Work has not started yet. Will be simple website for uploading new posts and author profiles.
