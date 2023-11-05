import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css' // Import the Snow theme CSS
import styles from './admin.module.css'
interface RichTextEditorProps {
  onChange: (value: string) => void
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ onChange }) => {
  const [editorValue, setEditorValue] = useState('')

  const handleEditorChange = (newValue: string) => {
    setEditorValue(newValue)
    onChange(newValue) // Notify the parent component of the change
  }
  const customStyles = {
    fontWeight: 'normal',
    textTransform: 'none',
    wordWrap: 'break-word',
    width: '450px',
    /* Add any other styles as needed */
  }
  return (
    <ReactQuill
      style={customStyles as any}
      theme='snow'
      value={editorValue}
      onChange={handleEditorChange}
    />
  )
}

export default RichTextEditor
