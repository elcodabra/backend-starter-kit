import { Get, Post, Body, Controller } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

// import { NodeMailgun } from 'ts-mailgun'

import { isValidEmail } from './util/email'
import { UserService } from './modules/user/services/user.service'
import { User } from './entity/user'
import { truthy } from './lib/common'

@Controller('/')
export class ForgotController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}
  @Get('/')
  health(): string {
    return 'OK'
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() body) {
    const { email } = body
    if (!isValidEmail(email)) {
      return { success: false, message: 'email is not valid.' }
    }
    const user = await this.userService.findOneByEmail(email)
    if (!user) {
      // no such email, but we still response with success for security reasons
      return {
        success: true,
        message: `Request is successfully processed`
      }
    }
    return await this.sendRecoveryEmail(user)
  }

  @Post('/check-reset-token')
  async checkResetToken(@Body() body) {
    const { token } = body

    const resetToken = await this.userService.getResetTokenObject(token)
    if (!resetToken) {
      return { success: false, message: 'Reset token does not exist.' }
    }
    if (truthy(resetToken.used)) {
      return {
        success: false,
        message: 'Reset token was already used to reset password.'
      }
    }

    return {
      success: true,
      message: `Reset token is valid to reset password.`
    }
  }

  @Post('/reset-password')
  async resetPassword(@Body() body) {
    const { token, password } = body

    const resetToken = await this.userService.getResetTokenObject(token)
    if (!resetToken) {
      return { success: false, message: 'Reset token does not exist.' }
    }
    if (truthy(resetToken.used)) {
      return {
        success: false,
        message: 'Reset token was already used to reset password.'
      }
    }

    await this.userService.resetPassword(resetToken.userId, password)
    resetToken.used = true
    await this.userService.usedToken(resetToken)
    return { success: true, message: `password has been reset.` }
  }

  private generateToken(len: number): string {
    const chars =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

    let token = ''
    for (let i = 0; i < len; i++) {
      const rnum = Math.floor(Math.random() * chars.length)
      token += chars.substring(rnum, rnum + 1)
    }

    return token
  }

  private async sendRecoveryEmail(user: User) {
    /*
    TODO:
    const mailer = new NodeMailgun()
    mailer.apiKey = this.configService.get('mailgun.apiKey') ?? ''
    mailer.domain = this.configService.get('mailgun.domain') ?? ''
    mailer.fromEmail = this.configService.get('mailgun.from') ?? ''
    mailer.fromTitle = 'Recovery Email'
    mailer.options = {
      host: this.configService.get('mailgun.host')
    }

    mailer.init()
    */
    const domain = 'http://192.168.3.191:3000'

    const token = this.generateToken(36)
    await this.userService.requestResetPassword(user.id, token)

    const env = process.env.ENV
    /*
    if (env === 'STAGING') {
      domain = 'https://staging.restaurants.hostedkitchens.com'
    } else if (env === 'PRODUCTION') {
      domain = 'https://restaurants.hostedkitchens.com'
    }
    */

    const emailContent = `
      <h1>Hello ${user.firstName} ${user.lastName}!</h1>
      <p>
        Forgot your password?
      </p>
      <p>
        To reset your password, click on the button below: <br />
        <a href='${domain}/reset-password?request=${token}'
          style="font-weight: 500;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            line-height: 20px;
            font-size: 14px;
            text-align: center;
            padding: 8px 16px;
            border-radius: 3px;
            box-shadow: none;
            user-select: none;
            outline: none;
            border: 0px;
            min-width: 56px;
            color: rgb(255, 255, 255);
            fill: rgb(255, 255, 255);
            background: rgb(67, 155, 115);
          "
        >Reset Password</a>
      </p>
      <p>
        Or copy and paste the URL into your browser: <br />
        <a href='${domain}/reset-password?request=${token}'>${domain}/reset-password?request=${token}</a>
      </p>
    `

    // Send an email to test@example.com
    try {
      /*
      TODO:
      const res = await mailer.send(
        user.email,
        'Recovery Email',
        emailContent
      )
      console.log(res)
      */
      return {
        success: true,
        message: `Request is successfully processed`,
        token,
      }
    } catch (ex) {
      if (ex instanceof Error) {
        console.error('Error: ', ex)
        return { success: false, message: ex.toString() }
      }
    }
    return
  }
}
