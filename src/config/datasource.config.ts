import { DataSource } from 'typeorm'

const ormConfig = require('../../ormconfig')

export const AppDataSource = new DataSource(ormConfig)
