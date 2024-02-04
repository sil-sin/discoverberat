import { SetStateAction, useState } from 'react'

import Card from '@/components/simple/Card'

import Tour from '@/components/Tour'
import TransfersCard from '@/components/simple/TransferCards'
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
    ? {
        ...Object.entries(previewContent).reduce(
          (result: any, [key, value]: any) => {
            if (value && value['en-US']) {
              result[key] = value['en-US'] as string | number
            }
            return result
          },
          {}
        ),
        imgUrl: previewContent.imgUrl,
        description: previewContent.description,
      }
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
          {entryId === 'transfers' && (
            <TransfersCard
              transfer={{
                from: fields?.from?.['en-US'],
                to: fields?.to?.['en-US'],
                price: fields?.price?.['en-US'],
                distance: fields?.distance?.['en-US'],
              }}
            />
          )}
          {entryId === 'serviceCard' && (
            <>Service card component tba</>
          )}
        </div>
      )}
    </div>
  )
}

export default PreviewTab
