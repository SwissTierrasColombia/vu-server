import path from 'path';
import dotenv from 'dotenv';

// Load enviroment variables
dotenv.config();

const APP_NAME = `PM Server`;
const CLIENT = '/client';

export default {
  secret: `your_secret_key`, // Secret Key
  server: { // Express
    ip: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT,
  },
  log: false, // show logs
  // Roles: if a user has multiple roles, will take the time of the greater role
  roles: [
    {
      role: 'user',
      ttl: '60 minutes',
    }, {
      role: 'admin',
      ttl: '5 days'
    }
  ],
  path: {
    disabled: '/:url(api|assets|auth|config|lib|views)/*' // paths 404
  },
  "socket.io": { // Socket.io
    port: 8001, // public port listen, change also in views/default/demo.js
    example: true, // router -> http://localhost:8000/socket 
    redis: { // Redis config
      host: '127.0.0.1',
      port: 6379
    }
  },
  "redis-jwt": { // Sessions
    //host: '/tmp/redis.sock', //unix domain
    host: process.env.REDIS_JWT_HOST, //can be IP or hostname
    port: process.env.REDIS_JWT_PORT, // port
    maxretries: 10, //reconnect retries, default 10
    //auth: '123', //optional password, if needed
    db: 0, //optional db selection
    secret: process.env.REDIS_JWT_SECRET, // secret key for Tokens!
    multiple: true, // single or multiple sessions by user
    kea: false // Enable notify-keyspace-events KEA
  },
  mongoose: { // MongoDB
    // uri: mongodb://username:password@host:port/database?options
    uri: process.env.MONGO_CONNECTION,
    options: {
    },
    seed: {
      path: '/api/models/seeds/',
      list: [
        {
          file: 'p.typesData.seed',
          schema: 'PTypeDataModel',
          plant: 'once'
        },
        {
          file: 'p.step.seed',
          schema: 'PStepModel',
          plant: 'once'
        },
        {
          file: 'p.callback.seed',
          schema: 'PCallbackModel',
          plant: 'once'
        },
        {
          file: 'p.operator.seed',
          schema: 'POperatorModel',
          plant: 'once'
        },
        {
          file: 'vu.role.seed',
          schema: 'VURoleModel',
          plant: 'once'
        },
        {
          file: 'vu.entity.seed',
          schema: 'VUEntityModel',
          plant: 'once'
        },
        {
          file: 'vu.user.seed',
          schema: 'VUUserModel',
          plant: 'once'
        },
      ]
    },
  },
  swagger: { // Swagger
    enabled: true, // router -> http://localhost:8000/docs/
    info: {
      version: 'v1.0',
      title: APP_NAME,
      description: `RESTful API ${APP_NAME}`,
      "contact": {
        "name": "Developer",
        "url": "http://www.example.com",
        "email": "example@example.com"
      },
      "license": {
        "name": "MIT",
        "url": "https://github.com/kevoj/nodetomic-api/blob/master/LICENSE"
      }
    }
  },
  oAuth: { // oAuth
    local: {
      enabled: true
    }
  },
  bull: {
    redis: {
      host: process.env.QUEUE_REDIS_HOST,
      port: process.env.QUEUE_REDIS_PORT,
      password: process.env.QUEUE_REDIS_PASSWORD
    }
  },
  nodemailer: {
    host: process.env.MAIL_HOST,
    secure: process.env.MAIL_SECURE,
    port: process.env.MAIL_PORT,
    from: process.env.MAIL_FROM,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    }
  },
  otp: {
    step: 180, //seconds duration token
    algorithm: 'sha512',
    digits: 6
  },
  // globals
  mode: process.env.NODE_ENV || 'production', // mode
  name: APP_NAME, // name 
  node: parseInt(process.env.NODE_APP_INSTANCE) || 0, // node instance
  root: path.normalize(`${__dirname}/../..`), // root
  base: path.normalize(`${__dirname}/..`), // base
  client: `${path.normalize(`${__dirname}/../..`)}${CLIENT}`, // client
};