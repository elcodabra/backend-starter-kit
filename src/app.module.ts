import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'

import { RedisModule } from './lib/nestjs-redis'
import { UserModule } from './modules/user'
import { AuthModule } from './modules/auth'
import { AppController } from './app.controller'
import { ForgotController } from './forgot.controller'
import * as configJson from './config'
import { env } from './lib/common'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${env}`,
      isGlobal: true,
      load: Object.values(configJson)
    }),
    RedisModule.forRootAsync({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      useFactory: (configService: ConfigService) => configService.get('redis'),
      inject: [ConfigService]
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database')
      }),
      inject: [ConfigService]
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => ({
        ...configService.get('graphql'),
        // context: ({ req, res }) => ({ req, res }),
        fieldResolverEnhancers: ['guards', 'interceptors']
      }),
      inject: [ConfigService]
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController, ForgotController]
})
export class AppModule {}
