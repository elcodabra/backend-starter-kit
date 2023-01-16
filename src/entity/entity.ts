import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Entity {
  @Field(() => ID)
  id: string
}
