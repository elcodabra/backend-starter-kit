import { registerAs } from '@nestjs/config'

export default registerAs('auth', () => ({
  expireRefreshToken: 60 * 60 * 24 * 365, // 1 year
  expireResetPasswordToken: 60 * 5 // 5 mins
}))
