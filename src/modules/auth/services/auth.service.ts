import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

import { RefreshTokenService } from './refreshToken.service'
import { ResetPasswordTokenService } from './resetPasswordToken.service'

import {User, UserStatus} from '../../../entity/user'
import { UserService } from '../../user/services/user.service'
import { UserRoles } from '../../user/dto/user.dto'
import { verify, hash } from '../../../lib/passwordHasher'
import {
  SigninInput,
  SignupInput,
  ExchangeRefreshTokenInput,
  JwtPayload,
  ForgotPasswordInput,
  ResetPasswordInput,
  ConfirmInviteInput,
} from '../dto/auth.dto'
import { Nullable, truthy } from '../../../lib/common'

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly resetPasswordTokenService: ResetPasswordTokenService
  ) {}

  async login(data: SigninInput) {
    data.email = data.email.toLowerCase()
    const user = await this.validateUser(
      data.email,
      data.password,
    )
    return await this.getAuthResponse(user)
  }

  async confirmInvite(data: ConfirmInviteInput) {
    let user: Nullable<User> = null
    if (truthy(data.email)) {
      data.email = data.email.toLowerCase()
      user = await this.userService.findOneByEmail(data.email)
    }
    if (!user) {
      throw new Error('User not found')
    }
    await this.userService.save({
      id: user.id,
      passwordHash: hash(data.password),
      status: UserStatus.completed,
      // TODO: invitedBy
    })
    return await this.getAuthResponse(user)
  }

  async signup(data: SignupInput) {
    const user = await this.userService.create(data)
    return await this.getAuthResponse(user)
  }

  async exchangeRefreshToken(data: ExchangeRefreshTokenInput) {
    const { refreshToken, userId } = data
    await this.refreshTokenService.verify(refreshToken, userId)
    await this.refreshTokenService.rejectToken(refreshToken)
    const user = await this.userService.findOneById(userId)
    if (!user) {
      throw new Error('User not found')
    }
    return await this.getAuthResponse(user)
  }

  async forgotPassword(data: ForgotPasswordInput) {
    let user: Nullable<User> = null
    if (truthy(data.email)) {
      data.email = data.email.toLowerCase()
      user = await this.userService.findOneByEmail(data.email)
    }
    if (!user) {
      throw new Error('User not found')
    }
    const token = this.resetPasswordTokenService.genToken(16)
    const userId = user.id
    await this.resetPasswordTokenService.set(token, user)
    return {
      token,
      userId
    }
  }

  async resetPassword(data: ResetPasswordInput) {
    let user: Nullable<User> = null
    if (data.token) {
      const userId = await this.resetPasswordTokenService.verify(
        data.token
      )
      if (userId) {
        user = await this.userService.findOneById(userId)
      }
    }
    if (!user) {
      throw new Error('Invalid token')
    }
    await this.userService.save({
      id: user.id,
      passwordHash: hash(data.password)
    })
    await this.resetPasswordTokenService.rejectToken(data.token)
    return await this.getAuthResponse(user)
  }

  async validateUser(
    email: string,
    candidatePassword: string,
  ): Promise<User> {
    const user: Nullable<User> = await this.userService.findOneByEmail(
      email.toLowerCase()
    )
    if (!user) {
      throw new Error('User not found')
    }

    if (!verify(candidatePassword, user.passwordHash)) {
      throw new Error('Incorrect password')
    }
    return user
  }

  async getAuthResponse(user: User) {
    const payload = await this.getJwtPayload(user)
    const jwtToken = this.jwtService.sign(payload)
    const refreshToken = this.refreshTokenService.genToken(32)
    await this.refreshTokenService.set(refreshToken, user)
    return {
      jwtToken,
      refreshToken,
      status: user.status
    }
  }

  async getJwtPayload(user: User): Promise<JwtPayload> {
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRoles
    }
  }
}
