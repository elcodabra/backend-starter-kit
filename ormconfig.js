// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = {
  type: process.env.DATABASE_TYPE ?? 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: process.env.DATABASE_PORT ?? 5432,
  username: process.env.DATABASE_USERNAME ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? 'postgres',
  database: process.env.DATABASE_NAME ?? 'mydb',
  entities: [path.resolve(__dirname, './src/entity/*{.ts,.js}')],
  migrations: [path.resolve(__dirname, './src/migration/*{.ts,.js}')]
}
