/* eslint-disable @typescript-eslint/naming-convention */
import {createParamDecorator, ExecutionContext} from '@nestjs/common'
import {GqlExecutionContext} from '@nestjs/graphql'

import {User} from '../../entity/user'

export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context).getContext<{
      req: { user: User }
    }>()
    return ctx.req.user
  }
)
