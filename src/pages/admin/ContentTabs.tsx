'use client'
import client, { createContent } from '@/utils/contentful/contentful'
import { useState, useEffect, FC } from 'react'
import dynamic from 'next/dynamic'
import { FormEvent } from 'react'
import { ChangeEvent } from 'react'
import TurndownService from 'turndown'
import Upload from '@/utils/cloudinary/CloudinaryUpload'
import { uploadImage } from '@/utils/contentful/uploadImage'
import Button from '@/components/simple/Button'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const EditCreateTab: FC = () => {
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [selectedContentType, setSelectedContentType] = useState<string>('')
  const [formData, setFormData] = useState<any>()
  const [contentTypes, setContentTypes] = useState<any>([{ name: '', id: '' }])
  const [richTextContent, setRichTextContent] = useState<string | undefined>()
  const [dynamicFields, setDynamicFields] = useState([])

  const [imgUrl, setImgUrl] = useState('')

  const handleRichTextChange = (content: string) => {
    setRichTextContent(content)
  }

  useEffect(() => {
    if (typeof window === 'undefined' && typeof document === 'undefined') {
      return
    }
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
        return {
          id: field.id,
          name: field.name,
          type: field.type,
        }
      })

    setDynamicFields(selectedContentTypeFields)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prevData: any) => ({
      ...prevData,
      [name]: { 'en-US': +value ? +value : value },
    }))
  }

  function htmlToMarkdown(htmlText: string) {
    const turndownService = new TurndownService()

    // Use the 'turndown' library to convert HTML to Markdown
    const markdownText = turndownService.turndown(htmlText)

    return markdownText
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
      description: { 'en-US': htmlToMarkdown(richTextContent ?? '') },
      image: imageFields,
    }

    createContent(selectedContentType, filledFormData)
  }
  const customStyles = {
    fontWeight: 'normal', // Remove bold text
    textTransform: 'none', // Remove any text transformation
    wordWrap: 'break-word',
    width: '450px', // Wrap text within the parent container
    /* Add any other styles as needed */
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

        {dynamicFields.map((field: any) => (
          <div key={field.id}>
            {field.type === 'Text' && ReactQuill ? (
              <div>
                <label htmlFor={field.id}>{field.name}</label>
                <ReactQuill
                  theme='snow'
                  value={richTextContent ?? ''}
                  onChange={handleRichTextChange}
                  style={customStyles as any}
                />
              </div>
            ) : field.type === 'Link' ? (
              // Render the Upload component when field.type is 'Link'
              <div>
                <label htmlFor={field.id}>{field.name}</label>
                <Upload getImgUrl={(imageUrl: string) => setImgUrl(imageUrl)} />
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
