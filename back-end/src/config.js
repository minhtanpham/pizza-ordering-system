const config = {
  PORT: 5000,
  MONGO_DB_URL: 'mongodb://admin:pmtan056820703@minimalpm-shard-00-00-4zesj.mongodb.net:27017,minimalpm-shard-00-01-4zesj.mongodb.net:27017,minimalpm-shard-00-02-4zesj.mongodb.net:27017/minimal?ssl=true&replicaSet=MinimalPM-shard-0&authSource=admin&retryWrites=true&w=majority',
  MONGO_DB_URL_TEMP: 'mongodb://127.0.0.1:27017/admin',
  REDIS_DB_URL: '127.0.0.1',
  REDIS_DB_PORT: 6379,
  JWT_REFRESH_TOKEN_SECRET: 'minimalpm@r3freshtok3ntexxt',
  JWT_TOKEN_LIFE: '1h',
  JWT_REFRESH_TOKEN_LIFE: '2h',
  JWT_SECRET: 'minimalpm@secretl0ngtext',
};


export default config;