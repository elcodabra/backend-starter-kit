import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { BaseService } from '../../common/services/base.service'
import { User, UserStatus } from '../../../entity/user'
import { UserInput, UserRoles, UsersArgs } from '../dto/user.dto'
import { InviteInput, SignupInput } from '../../auth/dto/auth.dto'
import { Nullable } from '../../../lib/common'
import { hash } from '../../../lib/passwordHasher'
import { ResetPasswordToken } from '../../../entity/reset-password-token'

@Injectable()
export class UserService extends BaseService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ResetPasswordToken)
    private readonly resetPasswordTokenRepository: Repository<ResetPasswordToken>,
  ) {
    super()
  }

  async findAll(args?: UsersArgs): Promise<[User[], number]> {
    return this.userRepository.findAndCount(this.getFindAllQuery(args))
  }

  async findOneById(id: string): Promise<Nullable<User>> {
    // @ts-ignore
    const user = await this.userRepository.findOne(id)
    return user ?? null
  }

  async findOneByEmail(email: string): Promise<Nullable<User>> {
    // @ts-ignore
    const user = await this.userRepository.findOne({ email })
    return user ?? null
  }

  async create(data: SignupInput): Promise<User> {
    data.email = data.email.toLowerCase()
    const extend: { passwordHash: string } = {
      passwordHash: data.password
    }
    let user = await this.findOneByEmail(data.email)
    if (user) {
      throw new Error('Email address already exists')
    }
    user = await this.userRepository.save(
      this.userRepository.create({ ...data, ...extend })
    )
    return user
  }

  async findOrCreate(data: InviteInput): Promise<User> {
    data.email = data.email.toLowerCase()
    let user = await this.findOneByEmail(data.email)
    if (user) {
      return user
    }
    user = await this.userRepository.save(
      this.userRepository.create(data)
    )
    // send email
    return user
  }

  async invite(data: InviteInput): Promise<User> {
    data.email = data.email.toLowerCase()
    let user = await this.findOneByEmail(data.email)
    if (user) {
      throw new Error('Email address already exists')
    }
    user = await this.userRepository.save(
      this.userRepository.create(data)
    )
    // send email
    return user
  }

  async save(data: UserInput): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.userRepository.save(data)
  }

  async saveMany(data: UserInput[]): Promise<User[]> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await this.userRepository.save(data)
    return this.userRepository.findByIds(data.map(p => p.id))
  }

  async remove(id: string) {
    // @ts-ignore
    const user = await this.userRepository.findOne(id)
    if (!user) {
      return null
    }
    await this.userRepository.delete(id)
    return { id }
  }

  async updatePhoneNumber(
    userId: string,
    phoneNumber: string
  ): Promise<Nullable<User>> {
    const user = await this.findOneById(userId)
    if (!user) {
      return null
    }
    user.phone = phoneNumber
    user.status = UserStatus.completed
    return this.userRepository.save(user)
  }

  async getCustomerCount(): Promise<number> {
    return this.userRepository.count({
      where: {
        role: UserRoles.consumer,
      }
    })
  }

  async requestResetPassword(
    userId: string,
    token: string
  ): Promise<ResetPasswordToken> {
    return this.resetPasswordTokenRepository.save(
      this.resetPasswordTokenRepository.create({
        userId,
        resetToken: token,
        used: false
      })
    )
  }

  async getResetTokenObject(
    token: string
  ): Promise<Nullable<ResetPasswordToken>> {
    // @ts-ignore
    return this.resetPasswordTokenRepository.findOne({ resetToken: token })
  }

  async resetPassword(
    userId: string,
    password: string
  ): Promise<Nullable<User>> {
    // @ts-ignore
    const user = await this.userRepository.findOne({ id: userId })
    if (!user) {
      return null
    }
    user.passwordHash = password && hash(password)

    return this.userRepository.save(user)
  }

  async usedToken(resetToken: ResetPasswordToken) {
    return this.resetPasswordTokenRepository.save(resetToken)
  }
}
