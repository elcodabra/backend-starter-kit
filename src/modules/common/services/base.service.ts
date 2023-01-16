import { FindManyOptions } from 'typeorm'
import { fromPairs } from 'lodash'

import { truthy } from '../../../lib/common'

export abstract class BaseService {
  protected getFindAllQuery(
    query: any,
    extra: FindManyOptions = {}
  ): FindManyOptions {
    const { page, skip, limit, sort, ...where } = query
    return {
      skip: skip > 0 ? skip : (page - 1) * limit,
      take: limit,
      order: truthy(sort) ? fromPairs([sort]) : { id: 'ASC' },
      where,
      ...extra
    }
  }
}
