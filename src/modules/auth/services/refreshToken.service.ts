import crypto from 'crypto'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Redis } from 'ioredis'

import { falsy, truthy } from '../../../lib/common'
import { RedisService } from '../../../lib/nestjs-redis'
import { User } from '../../../entity/user'

@Injectable()
export class RefreshTokenService {
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
      this.configService.get('auth.expireRefreshToken') ?? 60,
      user.id
    )
  }

  async get(token: string) {
    return await this.redisService.get(token)
  }

  async rejectToken(token: string) {
    await this.redisService.del(token)
  }

  async verify(token: string, userId: any) {
    const tokenedUserId = await this.redisService.get(token)
    if (falsy(tokenedUserId)) {
      throw new Error('Refresh token is invalid')
    }
    if (truthy(userId) && tokenedUserId !== userId) {
      throw new Error('Refresh token does not belong to this user')
    }
    return tokenedUserId
  }
}
