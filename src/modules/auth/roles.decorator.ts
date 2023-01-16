import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common'

import { RolesGuard } from './roles.guard'

export function Roles(...roles: string[]): MethodDecorator {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(RolesGuard))
}
