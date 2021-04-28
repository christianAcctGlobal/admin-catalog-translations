import React, { FC, SyntheticEvent } from 'react'
import { Input } from 'vtex.styleguide'
import { useMutation } from 'react-apollo'

import { useLocaleSelector } from '../LocaleSelector'
import { useAlert } from '../../providers/AlertProvider'
import useFormTranslation from '../../hooks/useFormTranslation'
import ActionButtons from '../ActionButtons'
import translateCollectionMutation from '../../graphql/translateCollections.gql'

interface CollectionsFormProps {
  collectionInfo: CollectionsName
  collectionId: string
  updateMemoCollections: (
    value: React.SetStateAction<{
      [Identifier: string]: CollectionsData
    }>
  ) => void
}

const CollectionsForm: FC<CollectionsFormProps> = ({
  collectionInfo,
  collectionId,
  updateMemoCollections,
}) => {
  const { isXVtexTenant, selectedLocale } = useLocaleSelector()
  const { openAlert } = useAlert()
  const mutationArgs = {
    to: selectedLocale,
    messages: {
      srcLang: isXVtexTenant,
      srcMessage: collectionInfo.name,
      context: collectionId,
      targetMessage: 'texto del form?',
    },
  }
  const {
    formState,
    canEdit,
    handleInputChange,
    changed,
    handleToggleEdit,
  } = useFormTranslation(mutationArgs)

  const [translateCollection, { loading }] = useMutation<
    { translateCollection: boolean },
    { args: SaveArgsV2 }
  >(translateCollectionMutation)

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    if (loading) {
      return
    }
    const args = {
      ...formState,
    }
    try {
      const { data, errors } = await translateCollection({
        variables: {
          args,
        },
      })
      const { translateCollection: translateCollectionResult } = data ?? {}
      if (translateCollectionResult) {
        // update cache value (local state)
        openAlert('success', 'Collections')
      }
      if (errors?.length) {
        throw new TypeError('Error translation Collections')
      }
    } catch (err) {
      openAlert('error', 'Collections')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb5">
          <Input
            label="Name"
            value={formState.messages.srcMessage}
            name="name"
            disabled={isXVtexTenant || !canEdit}
            onChange={handleInputChange}
          />
        </div>
        {isXVtexTenant ? null : (
          <ActionButtons
            toggleEdit={handleToggleEdit}
            canEdit={canEdit}
            changed={changed}
            loading={loading}
          />
        )}
      </form>
    </div>
  )
}

export default CollectionsForm
