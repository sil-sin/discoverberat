import React, { useState, useEffect, MouseEventHandler } from 'react'
import dynamic from 'next/dynamic'
import { FormEvent, ChangeEvent } from 'react'
import TurndownService from 'turndown'

import client, { createContent } from '@/utils/contentful/contentful'
import { uploadImage } from '@/utils/contentful/uploadImage'
import Button from '@/components/simple/Button'
import 'react-quill/dist/quill.snow.css'

const ReachTextEditor = dynamic(() => import('./RichtextInput'), {
  ssr: false,
})

const EditCreateTab: React.FC<{
  onPreviewClick: (description: any, imgUrl: any) => void
  selectedContentType: string
  onContentTypeChange: (e: string) => void
  onFormChange: (formData: any) => void
}> = ({
  onPreviewClick,
  selectedContentType,
  onContentTypeChange,
  onFormChange,
}) => {
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  // const [selectedContentType, setSelectedContentType] = useState<string>('')
  const [formData, setFormData] = useState<any>()
  const [contentTypes, setContentTypes] = useState<any>([])
  const [richTextContent, setRichTextContent] = useState<string | undefined>('')
  const [dynamicFields, setDynamicFields] = useState<any>([])
  const [imgUrl, setImgUrl] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined' && typeof document === 'undefined') {
      return
    }

    async function fetchContentTypes() {
      try {
        const response = await client.getContentTypes()
        const contentTypesData = response.items.map((contentType) => ({
          name: contentType.name,
          id: contentType.sys.id,
          fields: contentType.fields,
        }))
        setContentTypes(contentTypesData)
      } catch (error) {
        console.error('Error fetching content types:', error)
      }
    }

    fetchContentTypes()
  }, [])

  const handleContentTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDynamicFields([])
    setFormData(null)

    onContentTypeChange(e.target.value)
    const selectedContentTypeFields = contentTypes
      .find((contentType: any) => contentType.id === e.target.value)
      .fields.map((field: any) => ({
        id: field.id,
        name: field.name,
        type: field.type,
      }))

    setDynamicFields(selectedContentTypeFields)
  }

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    const newFormData = {
      ...formData,
      [name]: { 'en-US': type === 'number' ? +value : value },
    }

    setFormData(newFormData) // Update the form data in the local state

    onFormChange(newFormData)
  }

  const htmlToMarkdown = (htmlText: string) => {
    const turndownService = new TurndownService()
    return turndownService.turndown(htmlText)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const image = await uploadImage(imgUrl)
    const imageFields = {
      'en-US': {
        sys: {
          type: 'Link',
          linkType: 'Asset',
          id: image?.sys.id,
        },
      },
    }
    const filledFormData = {
      ...formData,
      description: { 'en-US': htmlToMarkdown(richTextContent || '') },
      image: imageFields,
    }

    createContent(
      selectedContentType,
      selectedContentType === 'tourPage' ? filledFormData : formData
    )
  }

  return (
    <div>
      <div>
        <Button variant='secondary' onClick={() => setMode('create')}>
          Create
        </Button>
        <Button variant='secondary' onClick={() => setMode('edit')}>
          Edit
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='content-type'>Content Type:</label>
          <select
            id='content-type'
            name='content-type'
            value={selectedContentType}
            onChange={handleContentTypeChange}
          >
            <option value=''>Select a content type</option>
            {contentTypes.map((contentType: any) => (
              <option key={contentType.id} value={contentType.id}>
                {contentType.name}
              </option>
            ))}
          </select>
        </div>

        {dynamicFields.map((field: any) => {
          if (field.type === 'Text') {
            return (
              <div key={field.id}>
                <label htmlFor={field.id}>{field.name}</label>
                <ReachTextEditor onChange={setRichTextContent} />
              </div>
            )
          }

          if (field.type === 'Link') {
            return (
              <div key={field.id}>
                <label htmlFor={field.id}>{field.name}</label>
                {/* <Upload getImgUrl={setImgUrl} /> */}
              </div>
            )
          }

          if (field.type === 'Boolean') {
            return (
              <div key={field.id}>
                <label htmlFor={field.id}>{field.name}</label>
                <input
                  type='radio'
                  id={`${field.id}-true`}
                  name={field.id}
                  value='true'
                />
                <label htmlFor={`${field.id}-true`}>Yes</label>
                <input
                  type='radio'
                  id={`${field.id}-false`}
                  name={field.id}
                  value='false'
                />
                <label htmlFor={`${field.id}-false`}>No</label>
              </div>
            )
          }

          return (
            <div key={field.id}>
              <label htmlFor={field.id}>{field.name}</label>
              <input
                type={field.type}
                id={field.id}
                name={field.id}
                onChange={handleFormChange}
              />
            </div>
          )
        })}
        <button
          type='button'
          onClick={() => {
            onPreviewClick(richTextContent, imgUrl)
          }}
        >
          Preview
        </button>
        <button type='submit'>{mode === 'create' ? 'Create' : 'Save'}</button>
      </form>
    </div>
  )
}

export default EditCreateTab
