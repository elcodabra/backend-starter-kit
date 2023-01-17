import {
  Resolver,
  ResolveField,
  Parent,
  Query,
  Args,
  Mutation
} from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { ID } from '@nestjs/graphql'

import { User } from '../../../entity/user'
import { GqlAuthGuard } from '../../auth/gqlauth.guard'
import { CurrentUser } from '../../auth/user.decorator'
import { UserService } from '../services/user.service'
import { Roles } from '../../auth/roles.decorator'
import {
  UserCreationInput,
  UserInput,
  UsersArgs,
  UsersResult,
  UserRoles,
  UserInviteInput,
} from '../dto/user.dto'

import { Entity } from '../../../entity/entity'

@UseGuards(GqlAuthGuard)
@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Roles('admin')
  @Query(() => UsersResult)
  async users(@Args() args: UsersArgs, @CurrentUser() user: User) {
    if (user.role === UserRoles.admin) {
      const [data, count] = await this.userService.findAll(args)
      return {
        data,
        count
      }
    } else {
      return {
        data: [],
        count: 0
      }
    }
  }

  @Roles('admin')
  @Query(() => User)
  async user(@Args({ name: 'id', type: () => ID }) id: string) {
    return this.userService.findOneById(id)
  }

  @Query(() => User)
  async getMe(@CurrentUser() user: User) {
    return user
  }

  @Query(() => Number)
  async customerCount(@CurrentUser() user: User) {
    if (user.role !== UserRoles.admin) {
      return 0
    }
    return await this.userService.getCustomerCount()
  }

  @Roles(UserRoles.admin, UserRoles.manager)
  @Mutation(() => User)
  async inviteUser(
    @Args({ name: 'data', type: () => UserInviteInput })
      { role = UserRoles.consumer, ...data }: UserInviteInput,
    @CurrentUser() current: User
  ) {
    const user = await this.userService.findOneByEmail(data.email)
    if (user) {
      return this.userService.save(user)
    }
    return this.userService.invite({
      ...data,
      role,
      invitedBy: current.id,
      invitedDate: new Date(),
    })
  }

  @Roles('admin')
  @Mutation(() => User)
  async createUser(
    @Args({ name: 'data', type: () => UserCreationInput })
      data: UserCreationInput
  ) {
    return this.userService.create(data)
  }

  @Roles('admin')
  @Mutation(() => User)
  async saveUser(
    @Args({ name: 'data', type: () => UserInput }) data: UserInput
  ) {
    return this.userService.save(data)
  }

  @Roles('admin')
  @Mutation(() => [User])
  async saveUsers(
    @Args({ name: 'data', type: () => [UserInput] }) data: UserInput[]
  ) {
    return this.userService.saveMany(data)
  }

  @Roles('admin')
  @Mutation(() => Entity)
  async removeUser(@Args({ name: 'id', type: () => ID }) id: string) {
    return this.userService.remove(id)
  }

  @ResolveField('name', () => String, { nullable: true })
  async name(@Parent() user: User) {
    return user.name
  }
}
