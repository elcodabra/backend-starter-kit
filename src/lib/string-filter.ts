import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common'
import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql'

import { falsy, truthy } from './common'

class ContainsImageUrl {
  imageUrl?: string | null
  cover?: string | null
}

function replacePlaceholder(data: ContainsImageUrl) {
  const { imageUrl, cover } = data
  if (truthy(imageUrl) && imageUrl.indexOf('placeholder') !== -1) {
    data['imageUrl'] = null
  }
  if (truthy(cover) && cover.indexOf('placeholder') !== -1) {
    data['cover'] = null
  }

  return data
}
@Injectable()
export class PlaceholderPipe implements PipeTransform {
  transform(data: ContainsImageUrl, metadata: ArgumentMetadata) {
    return replacePlaceholder(data)
  }
}

@Injectable()
export class PlaceholderArrayPipe implements PipeTransform {
  transform(data: ContainsImageUrl[], metadata: ArgumentMetadata) {
    return data.map(el => replacePlaceholder(el))
  }
}

export const placeholderMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn
) => {
  const value = await next()
  if (falsy(value)) {
    return 'https://restaurants.hostedkitchens.com/uploads/food-placeholder.png'
  }
  return value
}
