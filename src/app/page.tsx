"use client"

import { useState, useRef } from "react"
import { Sidebar } from "@/components/Sidebar"
import { Editor } from "@/components/Editor"
import { PreviewPane } from "@/components/PreviewPane"
import { Toolbar } from "@/components/Toolbar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { useDebouncedCallback } from "use-debounce"
import { useUndo } from "@/hooks/use-undo"

const initialCode = `graph TD
A[Client] --> B[Load Balancer]
B --> C[Server01]
B --> D[Server02]`

const shapeMap: {[key: string]: string} = {
  rectangle: 'rect',
  rounded: 'rounded',
  circle: 'circle',
  stadium: 'stadium'
};

const convertNodesToCode = (nodes: Array<{id: string; type: string}>) => {
  let codeLines = [];
  codeLines.push(...nodes.map(node => `${node.id}["${node.type}"]`));
  codeLines.push(...nodes.map(node => `${node.id}@{"shape": "${shapeMap[node.type] || 'rect'}"}`));
  return codeLines.join('\n');
};

export default function Home() {
  const [code, setCode] = useState(initialCode)
  const debouncedSetCode = useDebouncedCallback(setCode, 300)
  const [selectedType, setSelectedType] = useState("flowchart")
  const { canUndo, canRedo, undo, redo, addToHistory } = useUndo<string>(code)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleChartTypeSelect = (type: string, sampleCode: string) => {
    setSelectedType(type)
    if (sampleCode) {
      setCode(sampleCode)
    }
  }

  const handleRun = () => {
    console.log("Running diagram")
  }

  const handleExport = (format: string) => {
    console.log(`Exporting as ${format}`)
  }

  const handleAddNode = (node: { id: string; type: string }, e: React.MouseEvent) => {
    const newCode = `${code}\n${convertNodesToCode([node])}`;
    setCode(newCode);
    addToHistory(newCode);
  };

  return (
    <ErrorBoundary>
      <div ref={containerRef} className="flex h-screen w-screen overflow-hidden">
        <aside className="w-64 border-r border-border bg-background">
          <Sidebar onChartTypeSelect={handleChartTypeSelect} selectedType={selectedType} />
        </aside>

        <main className="flex-1 flex flex-col">
          <nav className="h-14 border-b border-border bg-background flex items-center px-4 justify-between">
            <div className="flex items-center space-x-4">
              <span className="font-semibold">Mermaid AI</span>
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm">Editor</span>
              <span className="text-muted-foreground text-sm">Whiteboard</span>
            </div>
            <Toolbar onExport={handleExport} />
          </nav>

          <div className="flex-1 flex">
            <div className="w-1/3 border-r border-border">
              <Editor onChange={debouncedSetCode} initialValue={code} />
            </div>
            <div className="w-2/3">
              <PreviewPane 
                code={code}
                onHistoryChange={addToHistory}
                onUndo={undo}
                onRedo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
                onAddNode={handleAddNode}
              />
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  )
}

