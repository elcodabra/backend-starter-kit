
const ormConfig = require('../../ormconfig')

import { registerAs } from '@nestjs/config'

import { env } from '../lib/common'

const isTest = env === 'test'

export default registerAs('database', () => ({
  ...ormConfig,
  synchronize: isTest,
  logging: isTest ? false : ['log', 'info', 'warn', 'error'],
  migrationsRun: !isTest,
}))
