# Tia Tac Toe Real-time Gaming App

Experience a classic joy of childhood gaming built with Next.js, Express.js, and TypeScript. Enjoy seamless real-time multiplayer interactions via WebSocket, with live scoreboard updates using an in-memory MongoDB server.

![game screenshot](./frontend/src/app/assets/ttt_ss.png 'game screenshot')

## Application Stack

- **Frontend**

  - [ **Next.JS** ] - Employed SSR, strategically implementing client-side and server-side components based on distinct scenarios
  - [ **TypeScript** ] - Industry-standard superset of JavaScript
  - [ **Socket.io-Client** ] - Facilitate bi-directional WebSocket connections

- **Backend**

  - [ **Express.JS** ] - Business Requirement
  - [ **TypeScript** ] - Industry-standard superset of JavaScript
  - [ **Socket.io** ] - A library for creating low-latency, high-throughput bi-directional WebSocket connections, enhancing players' gaming experiences with extraordinary real-time communication
  - [ **MongoDB Server in Memory** ] - Business Requirement, also really easy to setup
  - [ **RESTFul API** ] - Opting for a RESTful API to bridge the gap between the frontend and the database is logical, as it as it doesn't require a real-time connection
  - [ **Winston** ] - Powerful logger framework widely used in Node.JS environment

## Testing - Jest for both FE and BE

- The Reasons for choosing **Jest** as testing framework

  - Powerful testing framework that is popular in JavaScript Community
  - Built-in test runner, mocking, async and code coverage
  - Big companies such as Airbnb, Meta, Instagram using Jest

- How to test

  - Testing Frontend

    ```
    $ cd [project folder]
    $ cd frontend

    $ npm run test
    or
    $ npm run test:watch
    or
    $ npm run test:coverage
    ```

  - Testing Backend

    ```
    $ cd [project folder]
    $ cd backend

    $ npm run test
    or
    $ npm run test:watch
    or
    $ npm run test:coverage
    ```

## How to run the game

- Download the repo zip file locally

  ```
  https://github.com/lookingforcharlie/ttt_sa_charlie/archive/refs/heads/main.zip
  ```

- Unzip the downloaded zip file, and move it to your preferable place
- Start the backend server

  ```
  $ cd [project folder]
  $ cd backend

  $ npm install
  ---- waiting for installation finished ----
  $ npm run game
  ```

  > <span style="font-size: 1.5rem;">Backend will be hosted on port 3003, please make port 3003 available</span>

- cd into backend folder, run 'npm install', run 'npm run game' to start the backend.

  ```
  $ cd [project folder]
  $ cd frontend

  $ npm install
  ---- waiting for installation finished ----
  $ npm run game
  ```

- Open browser or a new tab of browser, go to 'http://localhost:3000'
- Open another browser or another new tab of browser, go to 'http://localhost:3000'
- Input different player name and same room name respectively

<span style="font-size: 2em; font-weight: bold;">Gaming Time!</span>

## System Design Diagram

![design diagram](./frontend/src/app/assets/ttt_diagram_md.png 'design diagram')
