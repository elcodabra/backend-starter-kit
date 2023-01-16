import { ArgsType, Field, Int } from '@nestjs/graphql'

import { Min, Max, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

@ArgsType()
export class BaseArgs {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number = 1

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  skip?: number = 0

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 25

  @Field(() => [String], { nullable: true })
  @IsOptional()
  sort?: string[]
}
