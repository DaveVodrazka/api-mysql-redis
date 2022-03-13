# API with MySQL and Redis

This project consists of several microservices ran by *docker compose*.

The microservices are following:

 - **API** - communicates with frontend and backend
 - **DB** - MySQL database holding Posts and Authors
 - **Redis** - database cache
 - **Client** - frontend using the API - not working yet
 - **CDN** - Nginx for storing assets, mostly images - not working yet
 - **Admin** - frontend for uploading and editing data in the database - work has not started yet

## API

Runs in *Nodejs*, is written in *TypeScript*. Core technologies *express*, *mysql2*, *redis* and *graphql* NPM packages.

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
