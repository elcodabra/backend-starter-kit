import { Field, ObjectType, ID } from '@nestjs/graphql'

import {
  Column,
  Entity,
  Unique,
  OneToMany,
  PrimaryGeneratedColumn,
  BeforeInsert
} from 'typeorm'
import { Exclude } from 'class-transformer'

import { UserRoles } from '../modules/user/dto/user.dto'
import { hash } from '../lib/passwordHasher'

import { DefaultEntity } from './default/defaultEntity'
import { Address } from './address'
import { Order } from './order'

export enum UserStatus {
  pending = 'pending',
  completed = 'completed',
  error = 'error'
}

@ObjectType()
@Unique(['email'])
@Entity('user')
export class User extends DefaultEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column({ name: 'email' })
  email: string

  @Field({ nullable: true })
  @Column({ name: 'first_name', nullable: true })
  firstName: string

  @Field({ nullable: true })
  @Column({ name: 'last_name', nullable: true })
  lastName: string

  @Field({ nullable: true })
  get name(): string {
    return String(`${this.firstName || ''} ${this.lastName || ''}`).trim()
  }

  @Field({ nullable: true })
  @Column({ name: 'phone', nullable: true })
  phone: string

  @Field({ defaultValue: UserRoles.consumer })
  @Column({ name: 'role', default: UserRoles.consumer })
  role?: string

  @Field({ defaultValue: UserStatus.pending })
  @Column({ name: 'status', default: UserStatus.pending })
  status: string

  @Column({
    name: 'places',
    array: true,
    nullable: true,
    type: 'varchar'
  })
  @Field(() => [ID], { nullable: true })
  places?: string[] | null

  @Column({
    name: 'stripe_customer_id',
    nullable: true,
    type: 'character varying'
  })
  stripeCustomerId?: string

  @Exclude()
  @Column({ name: 'password_hash', nullable: true })
  passwordHash: string

  // Relations
  @Field(() => [Address], { nullable: true })
  @OneToMany(() => Address, address => address.place)
  addresses: Address[]

  @OneToMany(() => Order, order => order.placeId)
  orders?: Order[]

  @BeforeInsert()
  hashPassword() {
    this.passwordHash = this.passwordHash && hash(this.passwordHash)
  }
}
