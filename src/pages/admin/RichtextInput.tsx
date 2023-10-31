// components/RichTextEditor.tsx
import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  return (
    <ReactQuill
      theme='snow'
      value={value}
      onChange={(newValue) => onChange(newValue)}
    />
  )
}

export default RichTextEditor
