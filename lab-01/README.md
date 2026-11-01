# Lab 1: Node.js and Express Server

## Student Details
- **Name:** Tejaswini
- **Registration Number:** 252U1R3071
- **Course:** B.Tech
- **Section:** CSE DS

## Objective
To set up a Node.js project and create a web server using the built-in HTTP module and Express.js.

## Technologies Used
- Node.js
- Express.js
- JavaScript
- Visual Studio Code

## Installation and Execution

1. Install Node.js and npm.
2. Open the project folder in VS Code.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the Express server:

   ```bash
   node app.js
   ```

5. Open the endpoints in your browser.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Displays welcome message |
| GET | `/about` | Displays student information in JSON |
| GET | `/time` | Displays current date and time |
| GET | Unknown route | Returns 404 Page Not Found |

## Screenshots

- [Home Page](screenshots/home.png.png)
- [About Page](screenshots/about.png.png)
- [Time Page](screenshots/time.png.png)
- [404 Page](screenshots/not-found.png.png)

## Deployment
Not deployed yet. Deployment link will be added after hosting the application.

## Learning Outcome
Learned how to create a Node.js HTTP server, use Express.js, handle GET requests, send responses, and manage routes and status codes.