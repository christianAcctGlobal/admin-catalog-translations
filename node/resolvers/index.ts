import { Category, queries as categoryQueries } from './category'
import {
  Product,
  queries as productQueries,
  mutations as productMutations,
} from './product'
import { SKU, queries as skuQueries } from './SKU'
import {
  Brand,
  queries as brandQueries,
  mutations as brandMutations,
} from './brand'
import { queries as translationUploadRequestInfo } from './translation'

export const queries = {
  ...categoryQueries,
  ...productQueries,
  ...skuQueries,
  ...brandQueries,
  ...translationUploadRequestInfo,
}

export const resolvers = {
  Category,
  Product,
  SKU,
  Brand,
}

export const mutations = {
  ...productMutations,
  ...brandMutations,
}
