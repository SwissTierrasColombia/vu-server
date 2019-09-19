# VENTANILLA ÚNICA - SERVER 

### Estructura

<pre> 
/src/
|-- api
|   |-- swagger
|   |-- controllers
|   |-- models
|   |-- sockets
|   |-- transformer
|   `-- business
|-- assets
|-- auth
|   |-- swagger
|   |-- controllers
|   |-- passports
|   `-- services
|-- config
|-- lib
|   |-- express
|   |-- mongoose
|   |-- redis-jwt
|   |-- socket.io
|   `-- swagger
|-- views
`-- app.js
</pre> 

## Requerimientos

- [Nodejs](https://nodejs.org) >= **6.x.x** 
- [MongoDB](https://www.mongodb.com)  >= **3.x.x**
- [Redis](https://redis.io)  >= **3.x.x** 

## Instalación

**Npm**

```bash
git clone https://github.com/AgenciaImplementacion/pm-server
cd pm-server
npm i
```