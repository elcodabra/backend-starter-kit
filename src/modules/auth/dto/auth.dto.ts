import {Field, ID, InputType, ObjectType} from '@nestjs/graphql'

import { MinLength, IsEmail, IsOptional, IsNotEmpty } from 'class-validator'

import { UserRoles } from '../../user/dto/user.dto'

@ObjectType()
export class AuthResponse {
  @Field({ nullable: true })
  refreshToken?: string

  @Field({ nullable: true })
  jwtToken?: string

  @Field({ nullable: true })
  status?: string

  constructor({
    refreshToken,
    jwtToken,
    status
  }: {
    refreshToken?: string
    jwtToken?: string
    status?: string
  }) {
    this.refreshToken = refreshToken
    this.jwtToken = jwtToken
    this.status = status
  }
}

@InputType()
export class ExchangeRefreshTokenInput {
  @Field()
  refreshToken: string

  @Field()
  userId: string
}

@InputType()
export class ForgotPasswordInput {
  @Field({ nullable: true })
  @IsOptional()
  email?: string

  @Field({ nullable: true })
  @IsOptional()
  phone?: string
}

@InputType()
export class ResetPasswordInput {
  @Field()
  @IsNotEmpty()
  token: string

  @Field()
  @MinLength(5)
  @IsNotEmpty()
  password: string

  @Field({ nullable: true })
  @IsOptional()
  confirmPassword?: string
}

@ObjectType()
export class ForgotPasswordResponse {
  @Field()
  token: string

  @Field()
  userId: string
}

export class JwtPayload {
  userId: string
  email: string
  name?: string
  role: UserRoles
}

@InputType()
export class PhoneNumberInput {
  @Field()
  @IsNotEmpty()
  phone: string
}

@InputType()
export class SigninInput {
  @Field()
  @MinLength(6)
  email: string

  @Field()
  @MinLength(6)
  password: string
}

@InputType()
export class SignupInput {
  @Field()
  @IsEmail()
  email: string

  @Field()
  @MinLength(5)
  password: string

  @Field({ nullable: true })
  @IsOptional()
  phone?: string

  @Field({ nullable: true })
  @IsOptional()
  firstName?: string

  @Field({ nullable: true })
  @IsOptional()
  lastName?: string

  @Field({ nullable: true })
  @IsOptional()
  status?: string
}

@InputType()
export class InviteInput {
  @Field()
  @IsEmail()
  email: string

  @Field({ nullable: true })
  @IsOptional()
  firstName?: string

  @Field({ nullable: true })
  @IsOptional()
  lastName?: string

  @Field()
  role: string

  @Field(() => [ID])
  places: string[]

  @Field()
  invitedBy: string

  @Field()
  invitedDate: Date
}

@InputType()
export class ConfirmInviteInput {
  @Field()
  @MinLength(6)
  email: string

  @Field()
  @MinLength(6)
  password: string
}
