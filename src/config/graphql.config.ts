import { registerAs } from '@nestjs/config'

export default registerAs('graphql', () => ({
  playground: process.env.GRAPHQL_PLAYGROUND === 'true',
  debug: process.env.GRAPHQL_DEBUG === 'true',
  tracing: process.env.GRAPHQL_TRACING === 'true',
  autoSchemaFile: 'schema.gql',
  installSubscriptionHandlers: false,
  cors: true
}))
