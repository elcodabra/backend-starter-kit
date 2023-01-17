import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserService } from './services/user.service'
import { UserResolver } from './resolvers/user.resolver'

import { User } from 'entity/user'
import { ResetPasswordToken } from 'entity/reset-password-token'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      ResetPasswordToken
    ]),
  ],
  providers: [
    UserService,
    UserResolver,
  ],
  exports: [
    UserService,
    TypeOrmModule
  ]
})
export class UserModule {}
