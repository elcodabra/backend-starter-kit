import { registerAs } from '@nestjs/config'

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expire: process.env.JWT_EXPIRE_IN ?? '7d'
}))
