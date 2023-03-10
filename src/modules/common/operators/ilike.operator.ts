// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Connection, FindOperator, FindOperatorType } from 'typeorm'

class FindOperatorWithExtras<T> extends FindOperator<T> {
  constructor(
    type: FindOperatorType | 'ilike',
    value: FindOperator<T> | T,
    useParameter?: boolean,
    multipleParameters?: boolean
  ) {
    super(type, value, useParameter, multipleParameters)
  }

  toSql(
    connection: Connection,
    aliasPath: string,
    parameters: string[]
  ): string {
    if (this._type === 'ilike') {
      return `${aliasPath} ILIKE ${parameters[0]}`
    }

    return super.toSql(connection, aliasPath, parameters)
  }
}

/**
 * Find Options Operator.
 * Example: { someField: Like("%some sting%") }
 */
export function ILike<T>(
  value: T | FindOperator<T>
): FindOperatorWithExtras<T> {
  return new FindOperatorWithExtras('ilike', value)
}
