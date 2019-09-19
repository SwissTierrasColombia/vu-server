module.exports = {
  "apps": [
    {
      "name": "vu-api",
      "script": "./server/app.js",
      "instances": 'max',
      "exec_mode": "cluster",
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
