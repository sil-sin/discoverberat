// components/RichTextEditor.tsx
import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.core.css'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  return (
    <ReactQuill
      theme='core'
      value={value}
      onChange={(newValue) => onChange(newValue)}
    />
  )
}

export default RichTextEditor
