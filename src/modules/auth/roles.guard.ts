import { Reflector } from '@nestjs/core'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'

import { JwtPayload } from './dto/auth.dto'

import { Nullable } from '../../lib/common'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<null | string[]>(
      'roles',
      context.getHandler()
    )
    if (!roles || roles.length === 0) {
      return true
    }
    const { req } = context.getArgByIndex(2)
    const { user }: { user: Nullable<JwtPayload> } = req
    if (user) {
      return roles.includes(user.role)
    }
    return true
  }
}
