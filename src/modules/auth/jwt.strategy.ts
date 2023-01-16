import {
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GqlExecutionContext } from '@nestjs/graphql'
import { PassportStrategy } from '@nestjs/passport'

import { ExtractJwt, Strategy } from 'passport-jwt'

import { UserService } from '../user/services/user.service'
import { User } from '../../entity/user'
import { Nullable } from '../../lib/common'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret')
    })
  }

  async validate(payload: { userId: string }): Promise<User> {
    const user: Nullable<User> = await this.userService.findOneById(
      payload.userId
    )
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext<{ req }>().req
  }
}
