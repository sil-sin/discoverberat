import { SetStateAction, useState } from 'react'

import Card from '@/components/simple/Card'

import { useContentfulLiveUpdates } from '@contentful/live-preview/react'
import Tour from '@/components/Tour'
const PreviewTab = ({
  entryId,
  previewLoading,
  previewContent,
}: {
  entryId: any
  previewLoading: any
  previewContent: any
}) => {
  const fields = previewContent
  const [selectedValue, setSelectedValue] = useState('tour-card')

  const handleRadioChange = (e: {
    target: { value: SetStateAction<string> }
  }) => {
    setSelectedValue(e.target.value)
  }

  const tour: { [key: string]: string | number } = previewContent
    ? Object.keys(previewContent).reduce((result: any, key) => {
        if (previewContent[key] && previewContent[key]['en-US']) {
          result[key] = previewContent[key]['en-US'] as string | number
        }
        return previewContent.imgUrl
          ? { ...result, imgUrl: previewContent.imgUrl }
          : result
      }, {})
    : {}

  return (
    <div>
      {previewLoading && <p>Loading preview...</p>}

      {previewContent && (
        <div>
          <h2>Preview</h2>
          {entryId === 'tourPage' && (
            <>
              <div>
                <h2>Choose a value:</h2>
                <label>
                  <input
                    type='radio'
                    value='tour-card'
                    checked={selectedValue === 'tour-card'}
                    onChange={handleRadioChange}
                  />
                  Tour Card
                </label>

                <label>
                  <input
                    type='radio'
                    value='tour-page'
                    checked={selectedValue === 'tour-page'}
                    onChange={handleRadioChange}
                  />
                  Tour Page
                </label>
              </div>
              {selectedValue === 'tour-card' ? (
                <Card
                  title={fields?.title?.['en-US']}
                  price={fields?.price?.['en-US']}
                  imageSrc={fields?.image?.fields?.file?.url}
                  currency={fields?.currency?.['en-US']}
                  isLoading={previewLoading}
                />
              ) : (
                <Tour tour={tour} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default PreviewTab
