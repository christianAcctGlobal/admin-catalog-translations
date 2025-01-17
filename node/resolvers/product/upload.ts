import { ReadStream } from 'fs'

import {
  BUCKET_NAME,
  calculateExportProcessTime,
  PRODUCT_TRANSLATION_UPLOAD,
  CALLS_PER_MINUTE,
  parseStreamToJSON,
  uploadEntriesAsync,
} from '../../utils'

const uploadProductTranslations = async (
  _root: unknown,
  { products, locale }: { products: UploadFile<ReadStream>; locale: string },
  ctx: Context
) => {
  const {
    clients: { catalogGQL, licenseManager, vbase },
    vtex: { adminUserAuthToken, requestId },
  } = ctx

  const { createReadStream } = await products

  const productStream = createReadStream()

  const productsParsed = await parseStreamToJSON<ProductTranslationInput>(
    productStream
  )

  const {
    profile: { email },
  } = await licenseManager.getTopbarData(adminUserAuthToken as string)

  const allTranslationsMade = await vbase.getJSON<string[]>(
    BUCKET_NAME,
    PRODUCT_TRANSLATION_UPLOAD,
    true
  )

  const updateRequests = allTranslationsMade
    ? [requestId, ...allTranslationsMade]
    : [requestId]

  await vbase.saveJSON<string[]>(
    BUCKET_NAME,
    PRODUCT_TRANSLATION_UPLOAD,
    updateRequests
  )

  const requestInfo = {
    requestId,
    locale,
    translatedBy: email,
    createdAt: new Date(),
    estimatedTime: calculateExportProcessTime(
      productsParsed.length,
      CALLS_PER_MINUTE
    ),
  }

  await vbase.saveJSON<UploadRequest>(BUCKET_NAME, requestId, requestInfo)

  uploadEntriesAsync<ProductTranslationInput>(
    {
      entries: productsParsed,
      requestId,
      locale,
      bucket: BUCKET_NAME,
      translateEntry: catalogGQL?.translateProduct,
    },
    { vbase }
  )

  return requestId
}

const productTranslationsUploadRequests = async (
  _root: unknown,
  _args: unknown,
  ctx: Context
) =>
  ctx.clients.vbase.getJSON<string[]>(
    BUCKET_NAME,
    PRODUCT_TRANSLATION_UPLOAD,
    true
  )

export const mutations = { uploadProductTranslations }

export const queries = {
  productTranslationsUploadRequests,
}
