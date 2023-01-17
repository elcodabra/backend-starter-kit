import { Get, Controller, Req } from '@nestjs/common'
import { Request } from 'express'

@Controller('status')
export class AppController {
  @Get('/')
  health(): string {
    return 'OK'
  }

  @Get('/client')
  client(@Req() req: Request): string[] {
    console.log('req.socket.remoteAddress=', req.socket.remoteAddress)
    console.log('req.ip=', req.ip)
    return [req.socket.remoteAddress || '', req.ip]
  }
}
