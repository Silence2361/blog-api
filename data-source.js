require('ts-node/register');
require('dotenv').config();
const { DataSource } = require('typeorm');
const { User } = require('./dist/database/users/users.entity');
const { Article } = require('./dist/database/articles/articles.entity');

module.exports = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Article],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
