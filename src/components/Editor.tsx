import { useEffect, useState } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { markdown } from "@codemirror/lang-markdown"
import { EditorView } from "@codemirror/view"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"
import { linter } from "@codemirror/lint"
import { mermaidValidator } from "@/utils/mermaid-validator"

interface EditorProps {
  onChange: (value: string) => void
  initialValue?: string
}

export function Editor({ onChange, initialValue = "" }: EditorProps) {
  return (
    <div className="h-full w-full">
      <CodeMirror
        value={initialValue}
        height="100%"
        width="100%"
        extensions={[
          markdown(),
          EditorView.lineWrapping,
          linter(mermaidValidator)
        ]}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
        }}
        className="h-full text-sm"
      />
    </div>
  )
}

