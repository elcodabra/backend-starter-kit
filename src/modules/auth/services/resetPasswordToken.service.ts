import crypto from 'crypto'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Redis } from 'ioredis'

import { RedisService } from '../../../lib/nestjs-redis'
import { User } from '../../../entity/user'
import { falsy } from '../../../lib/common'

@Injectable()
export class ResetPasswordTokenService {
  private redisService: Redis

  constructor(
    private readonly configService: ConfigService,
    private readonly redis: RedisService
  ) {
    this.redisService = this.redis.getClient()
  }

  genToken(bytes: number): string {
    return crypto.randomBytes(bytes).toString('hex')
  }

  async set(token: string, user: User) {
    await this.redisService.setex(
      token,
      this.configService.get('auth.expireResetPasswordToken') ?? 60,
      user.id
    )
  }

  async rejectToken(token: string) {
    await this.redisService.del(token)
  }

  async verify(token: string) {
    const tokenedUserId = await this.redisService.get(token)
    if (falsy(tokenedUserId)) {
      throw new Error('Invalid token')
    }
    return tokenedUserId
  }
}
