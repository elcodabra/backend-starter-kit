import { Field, ObjectType, ID } from '@nestjs/graphql'

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { DefaultEntity } from './default/defaultEntity'

@ObjectType()
@Entity('reset_password_token')
export class ResetPasswordToken extends DefaultEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field(() => ID, { nullable: true })
  @Column({ type: 'uuid', name: 'user_id', nullable: true })
  userId: string

  @Field({ nullable: true })
  @Column({ name: 'reset_token', nullable: true })
  resetToken: string

  @Column({ name: 'used', nullable: true })
  @Field(() => Boolean, { defaultValue: false })
  used?: boolean
}
