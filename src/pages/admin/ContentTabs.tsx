import client from '@/contentful/contentful'
import React, { useState, useEffect } from 'react'

const EditCreateTab: React.FC = () => {
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [selectedContentType, setSelectedContentType] = useState<string>('')
  const [formData, setFormData] = useState({})

  const [contentTypes, setContentTypes] = useState<any>([{ name: '', id: '' }])

  useEffect(() => {
    client
      .getContentTypes()
      .then((response) => {
        const contentTypes = response.items.map((contentType) => {
          console.log(contentType)

          return {
            name: contentType.name,
            id: contentType.sys.id,
            fields: contentType.fields,
          }
        })
        //   setFormData({{id: contentTypes}})
        setContentTypes(contentTypes)
      })
      .catch((error) => {
        console.error('Error fetching content types:', error)
      })
  }, [])

  const handleContentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedContentType(e.target.value)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
  }

  useEffect(() => {
    if (mode === 'edit') {
      // You can fetch the data for the selected content type and pre-fill the formData
      // Example:
      // const data = fetchDataForSelectedContentType(selectedContentType);
      // setFormData(data);
    }
  }, [mode, selectedContentType])

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

        {selectedContentType &&
          contentTypes
            .filter(
              (contentType: any) => contentType.id === selectedContentType
            )[0]
            .fields.map((formData: any) => (
              <>
                <div>
                  <label htmlFor={formData.id}>{formData.name}</label>
                  <input
                    type='text'
                    id={formData.id}
                    name={formData.id}
                    onChange={handleFormChange}
                  />
                </div>
              </>
            ))}

        <button type='submit'>{mode === 'create' ? 'Create' : 'Save'}</button>
      </form>
    </div>
  )
}

export default EditCreateTab
