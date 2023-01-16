import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { RefreshTokenService } from './services/refreshToken.service'
import { ResetPasswordTokenService } from './services/resetPasswordToken.service'
import { AuthService } from './services/auth.service'
import { AuthResolver } from './resolvers/auth.resolver'
import { JwtStrategy } from './jwt.strategy'

import { UserModule } from '../user'

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.expire')
        }
      })
    }),
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    UserModule
  ],
  providers: [
    RefreshTokenService,
    ResetPasswordTokenService,
    AuthService,
    JwtStrategy,
    AuthResolver
  ],
  exports: [
    RefreshTokenService,
    ResetPasswordTokenService,
    AuthService,
    JwtStrategy,
    JwtModule
  ]
})
export class AuthModule {}
