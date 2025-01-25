import { useEffect, useState } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { markdown } from "@codemirror/lang-markdown"
import { EditorView } from "@codemirror/view"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"

interface EditorProps {
  onChange: (value: string) => void
  initialValue?: string
}

export function Editor({ onChange, initialValue = "" }: EditorProps) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    onChange(value)
  }, [value, onChange])

  return (
    <CodeMirror
      value={value}
      height="100%"
      extensions={[markdown(), EditorView.lineWrapping]}
      onChange={(val) => setValue(val)}
      theme={vscodeDark}
      className="h-full"
    />
  )
}

