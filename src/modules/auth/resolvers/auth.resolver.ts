import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { User } from '../../../entity/user'
import { CurrentUser } from '../user.decorator'
import { GqlAuthGuard } from '../gqlauth.guard'
import { AuthService } from '../services/auth.service'
import {
  AuthResponse,
  SigninInput,
  SignupInput,
  ExchangeRefreshTokenInput,
  ForgotPasswordInput,
  ForgotPasswordResponse,
  ResetPasswordInput,
  ConfirmInviteInput,
} from '../dto/auth.dto'

@Resolver(() => User)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
  ) {}

  // placeholder query to avoid error
  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async me(@CurrentUser() user: User) {
    return user
  }

  @Mutation(() => AuthResponse)
  async signin(
    @Args('signinInput') data: SigninInput
  ): Promise<AuthResponse> {
    return await this.authService.login(data)
  }

  @Mutation(() => AuthResponse)
  async confirmInvite(
    @Args('data') data: ConfirmInviteInput
  ): Promise<AuthResponse> {
    return await this.authService.confirmInvite(data)
  }

  @Mutation(() => AuthResponse)
  async exchangeRefreshToken(
    @Args('data') data: ExchangeRefreshTokenInput
  ): Promise<AuthResponse> {
    return await this.authService.exchangeRefreshToken(data)
  }

  @Mutation(() => AuthResponse)
  async signup(
    @Args('signupInput') data: SignupInput
  ): Promise<AuthResponse> {
    return await this.authService.signup(data)
  }

  @Mutation(() => ForgotPasswordResponse)
  async forgotPassword(@Args('data') data: ForgotPasswordInput) {
    return await this.authService.forgotPassword(data)
  }

  @Mutation(() => AuthResponse)
  async resetPassword(@Args('data') data: ResetPasswordInput) {
    return await this.authService.resetPassword(data)
  }
}
