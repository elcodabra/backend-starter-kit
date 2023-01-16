import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserService } from './services/user.service'
import { AddressService } from './services/address.service'
import { UserResolver } from './resolvers/user.resolver'
import { AddressResolver } from './resolvers/address.resolver'
import { PlaceService } from '../place/services/place.service'
import { StripeModule } from '../stripe'

import { Address } from 'entity/address'
import { User } from 'entity/user'
import { Place } from 'entity/place'
import { Order } from 'entity/order'
import { ResetPasswordToken } from 'entity/reset-password-token'
import { PlaceTable } from 'entity/place-table'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Address,
      User,
      Place,
      PlaceTable,
      Order,
      ResetPasswordToken
    ]),
    forwardRef(() => StripeModule)
  ],
  providers: [
    UserService,
    AddressService,
    PlaceService,
    UserResolver,
    AddressResolver,
  ],
  exports: [
    UserService,
    AddressService,
    TypeOrmModule
  ]
})
export class UserModule {}
