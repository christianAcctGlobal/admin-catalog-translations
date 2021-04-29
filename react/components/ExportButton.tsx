import React from 'react'
import { ButtonWithIcon, IconDownload } from 'vtex.styleguide'

import { useLocaleSelector } from './LocaleSelector'

interface Props {
  openExport: HandleOpen
}

const ExportButton = ({ openExport }: Props) => {
  const { isXVtexTenant } = useLocaleSelector()

  return isXVtexTenant ? null : (
    <div className="ml7">
      <ButtonWithIcon
        name="export-catalog"
        type="button"
        icon={<IconDownload />}
        variation="primary"
        onClick={() => openExport(true)}
      >
        Export
      </ButtonWithIcon>
    </div>
  )
}

export default ExportButton
