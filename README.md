# Tutoring-Schedule-backend

A personal project for Tutoring Schedule web-app backend using NodeJS, ExpressJS, MongoDB, and TypeScript.

## Typical features

### Encrypted and salt password

The application uses JWT for secure authentication. Besides, to increase the security, all users have a distinct salt string adding to their password. All passwords are encrypted and stored in database.

### Convenient tutoring schedule

Tutors can add their weekly schedule by adding their availability periods. And when students would like to see the availability, the server will divide the periods into 30-minute sessions for the schedule.

### NoSQL database

The code utilize pipeline MongoDB operations for reducing the runtime performance. Also, the database design implements 1-to-1, 1-to-many relationships.

### Conventional set up

The backend follows MVC design by separating `model`, `controller`, and `route`.

## How to run the web-app

### Set up environment variables

Create a `.env` file for enviroment variables with the format below:

```
CANVAS_DB_URI=""
ACCESS_TOKEN_SECRET=""
REFRESH_TOKEN_SECRET=""
PORT=5000
```

You need a MongoDB Atlas cluster to run the web app. The port number can be changed if you like.

### npm install

Install all dependencies for the web-app

### npm run start

Run the web-app on the desired port (e.g. 500).

### Swagger

The API docs can be accessed at [this page](http://localhost:5000/api-docs/)

## Collaboration

I'm open for any contribution to this web-app, either improve the code quality, add more features, or a frontend. Please contact me at hodangkhoinguyen@gmail.com
