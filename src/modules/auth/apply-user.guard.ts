import { Injectable } from '@nestjs/common'
import { GqlAuthGuard } from 'modules/auth/gqlauth.guard'

@Injectable()
export class ApplyUser extends GqlAuthGuard {
  handleRequest(err: any, user: any) {
    if (err) {
      throw err;
    }
    if (user) return user;
    return null;
  }
}
