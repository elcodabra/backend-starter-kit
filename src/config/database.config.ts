// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

import { registerAs } from '@nestjs/config'

import { env } from '../lib/common'

const isTest = env === 'test'

export default registerAs('database', () => ({
  type: process.env.DATABASE_TYPE ?? 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: process.env.DATABASE_PORT ?? 5432,
  username: process.env.DATABASE_USERNAME ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? 'postgres',
  database: process.env.DATABASE_NAME ?? 'mybooking',
  synchronize: isTest,
  logging: isTest ? false : ['log', 'info', 'warn', 'error'],
  migrationsRun: !isTest,
  entities: [path.resolve(__dirname, '../', 'entity/*{.ts,.js}')],
  migrations: [path.resolve(__dirname, '../', 'migration/*{.ts,.js}')]
}))
