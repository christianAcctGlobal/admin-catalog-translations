import React, { FC, SyntheticEvent, useState } from 'react'
import {
  InputSearch,
  PageBlock,
  Spinner,
  ButtonWithIcon,
  IconDownload,
  ModalDialog,
} from 'vtex.styleguide'

import { useLocaleSelector } from '../LocaleSelector'
import getProductQuery from '../../graphql/getProduct.gql'
import ProductForm from './ProductForm'
import ErrorHandler from '../ErrorHandler'
import useCatalogQuery from '../../hooks/useCatalogQuery'

const ProductTranslation: FC = () => {
  const [isExportOpen, setIsExportOpen] = useState(false)

  const {
    entryInfo,
    isLoadingOrRefetching,
    entryId,
    handleCleanSearch,
    handleEntryIdInput,
    fetchEntry,
    setMemoEntries,
    errorMessage,
  } = useCatalogQuery<
    ProductData,
    { identifier: { value: string; field: 'id' } }
  >(getProductQuery)

  const { selectedLocale, isXVtexTenant } = useLocaleSelector()

  const handleSubmitProductId = (e: SyntheticEvent) => {
    e.preventDefault()
    if (!entryId) {
      return
    }
    setMemoEntries({})
    fetchEntry({
      variables: { identifier: { field: 'id', value: entryId } },
    })
  }
  const { id, ...productInfo } = entryInfo?.product || ({} as Product)

  return (
    <>
      <main>
        <div className="flex">
          <div style={{ maxWidth: '340px' }} className="mv7">
            <InputSearch
              value={entryId}
              placehoder="Search product..."
              label="Product Id"
              size="regular"
              onChange={handleEntryIdInput}
              onSubmit={handleSubmitProductId}
              onClear={handleCleanSearch}
            />
          </div>
          {isXVtexTenant ? null : (
            <div className="mv7 self-end ml7">
              <ButtonWithIcon
                name="export-product"
                type="button"
                icon={<IconDownload />}
                variation="primary"
                onClick={() => setIsExportOpen(true)}
              >
                Export
              </ButtonWithIcon>
            </div>
          )}
        </div>
        {id || isLoadingOrRefetching || errorMessage ? (
          <PageBlock
            variation="full"
            title={`Product Info - ${selectedLocale}`}
          >
            {errorMessage ? (
              <ErrorHandler
                errorMessage={errorMessage}
                entryId={entryId}
                entry="Product"
              />
            ) : isLoadingOrRefetching ? (
              <Spinner />
            ) : (
              <ProductForm
                productInfo={productInfo}
                productId={entryId}
                updateMemoProducts={setMemoEntries}
              />
            )}
          </PageBlock>
        ) : null}
      </main>
      <ModalDialog
        isOpen={isExportOpen}
        cancelation={{
          label: 'Cancel',
          onClick: () => {
            setIsExportOpen(false)
          },
        }}
        confirmation={{
          label: 'Export Products',
          // eslint-disable-next-line no-console
          onClick: () => console.log('export'),
        }}
        onClose={() => {
          setIsExportOpen(false)
        }}
      >
        <p>Export product</p>
      </ModalDialog>
    </>
  )
}

export default ProductTranslation
