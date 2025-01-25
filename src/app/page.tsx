"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/Sidebar"
import { Editor } from "@/components/Editor"
import { PreviewPane } from "@/components/PreviewPane"
import { Toolbar } from "@/components/Toolbar"
import { SidebarProvider } from "@/components/ui/sidebar"
import mermaid from "mermaid"

const initialCode = `graph TD
A[Client] --> B[Load Balancer]
B --> C[Server01]
B --> D[Server02]`

export default function Home() {
  const [code, setCode] = useState(initialCode)
  const [selectedType, setSelectedType] = useState("flowchart")

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

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false })
  }, [])

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar onChartTypeSelect={handleChartTypeSelect} selectedType={selectedType} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Toolbar onRun={handleRun} onExport={handleExport} />
          <div className="flex-1 flex">
            <div className="w-1/2 border-r border-border">
              <Editor onChange={setCode} initialValue={code} />
            </div>
            <div className="w-1/2">
              <PreviewPane code={code} />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

