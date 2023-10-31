import client, { createContent } from '@/contentful/contentful'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { FormEvent } from 'react'
import { ChangeEvent } from 'react'
import RichTextEditor from './RichtextInput'

const EditCreateTab: React.FC = () => {
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [selectedContentType, setSelectedContentType] = useState<string>('')
  const [formData, setFormData] = useState({})
  const [contentTypes, setContentTypes] = useState<any>([{ name: '', id: '' }])
  const [richTextContent, setRichTextContent] = useState('')
  const [dynamicFields, setDynamicFields] = useState([])

  const handleRichTextChange = (content: string) => {
    setRichTextContent(content)
  }

  useEffect(() => {
    client
      .getContentTypes()
      .then((response) => {
        const contentTypes = response.items.map((contentType) => {
          return {
            name: contentType.name,
            id: contentType.sys.id,
            fields: contentType.fields,
          }
        })
        setContentTypes(contentTypes)
      })
      .catch((error) => {
        console.error('Error fetching content types:', error)
      })
  }, [])

  const handleContentTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedContentType(e.target.value)

    // Create dynamic form fields based on selected content type's fields
    const selectedContentTypeFields = contentTypes
      .find((contentType: any) => contentType.id === e.target.value)
      .fields.map((field: any) => {
        if (field.type === 'RichText') {
          return {
            id: field.id,
            name: field.name,
            type: 'RichText',
          }
        } else {
          return {
            id: field.id,
            name: field.name,
            type: field.type,
          }
        }
      })
    console.log(selectedContentTypeFields)

    const filtered = selectedContentTypeFields.filter(
      (field: any) => field.type === 'Symbol' || field.type === 'Number'
    )
    console.log(filtered)

    setDynamicFields(filtered)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    console.log({ [name]: { 'en-US': value } })

    setFormData((prevData) => ({
      ...prevData,
      [name]: { 'en-US': +value ? +value : value },
    }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const filledFormData = {
      ...formData,
      description: richTextContent,
    }

    createContent(selectedContentType, formData)
  }

  return (
    <div>
      <div>
        <button onClick={() => setMode('create')}>Create</button>
        <button onClick={() => setMode('edit')}>Edit</button>
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

        {dynamicFields.map((field: any) => (
          <div key={field.id}>
            {field.type === 'RichText' ? (
              <div>
                <label htmlFor={field.id}>{field.name}</label>
                {/* <RichTextEditor
                  value={richTextContent}
                  onChange={handleRichTextChange}
                /> */}
              </div>
            ) : (
              <div>
                <label htmlFor={field.id}>{field.name}</label>
                <input
                  type={field.type}
                  id={field.id}
                  name={field.id}
                  onChange={handleFormChange}
                />
              </div>
            )}
          </div>
        ))}

        <button type='submit'>{mode === 'create' ? 'Create' : 'Save'}</button>
      </form>
    </div>
  )
}

export default EditCreateTab
