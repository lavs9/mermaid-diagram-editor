import mermaid from 'mermaid'
import { LintSource, Diagnostic } from "@codemirror/lint"

export const mermaidValidator: LintSource = async (view) => {
  const errors = []
  try {
    await mermaid.parse(view.state.doc.toString())
  } catch (error) {
    const message = (error as Error).message.replace(/^Parse error on line (\d+):\n/, '')
    const line = parseInt(RegExp.$1) - 1
    errors.push({
      from: view.state.doc.line(line + 1).from,
      to: view.state.doc.line(line + 1).to,
      message: (error as Error).message,
      severity: "error" as const
    })
  }
  return errors
} 