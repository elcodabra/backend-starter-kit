import crypto from 'crypto'

const iterations = 1000
const keylen = 64
const digest = 'sha512'

export const genSalt = (saltRounds: number) => {
  return crypto.randomBytes(saltRounds).toString('hex')
}

const hashWithSalt = (password: string, salt: string) => {
  return crypto
    .pbkdf2Sync(password, salt, iterations, keylen, digest)
    .toString(`hex`)
}

export const hash = (password: string, saltRounds = 16) => {
  const salt = genSalt(saltRounds)
  const hashed = hashWithSalt(password, salt)
  return [salt, hashed].join('$')
}

export const verify = (password: string, hashedPassword: string) => {
  if (!password || !hashedPassword) {
    return false
  }
  const [salt, hashed] = hashedPassword.split('$')
  return hashWithSalt(password, salt) === hashed
}
