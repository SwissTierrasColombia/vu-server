module.exports = {
  "apps": [
    {
      "name": "vu-api",
      "script": "./server/app.js",
      "watch": false,
      "env": {
        "NODE_ENV": "development"
      },
      "env_production": {
        "NODE_ENV": "production"
      }
    }
  ]
}
