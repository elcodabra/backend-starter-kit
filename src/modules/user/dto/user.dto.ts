import {
  InputType,
  Field,
  ID,
  ObjectType,
  Int,
  ArgsType
} from '@nestjs/graphql'

import { IsNotEmpty, IsOptional, IsEmail, MinLength } from 'class-validator'

import { User } from '../../../entity/user'
import { BaseArgs } from '../../common/dto/base.args'

export enum UserRoles {
  consumer = 'consumer',
  manager = 'manager',
  admin = 'admin'
}

@ArgsType()
export class UsersArgs extends BaseArgs {
  @Field(() => String, { nullable: true })
  @IsOptional()
  role?: UserRoles

  @Field(() => String, { nullable: true })
  @IsOptional()
  search?: string
}

@ObjectType()
export class UsersResult {
  @Field(() => [User])
  data: User[]

  @Field(() => Int)
  count: number
}

@InputType()
export class UserInviteInput {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @Field({ nullable: true })
  @IsOptional()
  firstName?: string

  @Field({ nullable: true })
  @IsOptional()
  lastName?: string

  @Field({ nullable: true })
  @IsOptional()
  role?: string
}

@InputType()
export class UserCreationInput {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @Field()
  @MinLength(6)
  @IsNotEmpty()
  password: string

  @Field({ nullable: true })
  @IsOptional()
  phone?: string

  @Field()
  @IsNotEmpty()
  role: string

  @Field({ nullable: true })
  @IsOptional()
  firstName?: string

  @Field({ nullable: true })
  @IsOptional()
  lastName?: string
}

@InputType()
export class UserInput {
  @Field(() => ID)
  @IsNotEmpty()
  id: string

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string

  @Field({ nullable: true })
  @IsOptional()
  role?: string

  @Field({ nullable: true })
  @IsOptional()
  firstName?: string

  @Field({ nullable: true })
  @IsOptional()
  lastName?: string

  @IsOptional()
  passwordHash?: string

  @IsOptional()
  phone?: string

  @IsOptional()
  status?: string
}
