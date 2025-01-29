"use client"

import { useState, useRef, useEffect } from "react"
import { Sidebar } from "@/components/Sidebar"
import { Editor } from "@/components/Editor"
import { PreviewPane } from "@/components/PreviewPane"
import { Toolbar } from "@/components/Toolbar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { useDebouncedCallback } from "use-debounce"
import { useUndo } from "@/hooks/use-undo"
import { convertNodesToCode } from "@/lib/shapes"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"

const initialCode = `graph TD
n1[Client] --> n2[Load Balancer]
n2 --> n3[Server01]
n2 --> n4[Server02]`

const shapeMap: {[key: string]: string} = {
  rectangle: 'rect',
  rounded: 'rounded',
  circle: 'circle',
  stadium: 'stadium'
};

interface NodeType {
  id: string;
  type: string;
  fillColor?: string;
  borderWidth?: string;
  borderStyle?: string;
}

interface PreviewState {
  code: string;
  scale: number;
  position: { x: number; y: number };
}

export default function Home() {
  const [code, setCode] = useState(initialCode)
  const debouncedSetCode = useDebouncedCallback(setCode, 300)
  const [selectedType, setSelectedType] = useState("flowchart")
  const { canUndo, canRedo, undo, redo, addToHistory } = useUndo<PreviewState>({
    code: initialCode,
    scale: 1,
    position: { x: 0, y: 0 }
  })
  const containerRef = useRef<HTMLDivElement>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [pendingType, setPendingType] = useState<string>("")
  const [pendingSampleCode, setPendingSampleCode] = useState<string>("")
  const [currentCode, setCurrentCode] = useState(initialCode);

  useEffect(() => {
    console.log('Parent - Current code updated:', currentCode);
  }, [currentCode]);

  const handleChartTypeSelect = (type: string, sampleCode: string) => {
    if (code === sampleCode) return;
    
    setPendingType(type);
    setPendingSampleCode(sampleCode);
    setIsConfirmOpen(true);
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
    addToHistory({
      code: newCode,
      scale: 1,
      position: { x: 0, y: 0 }
    });
  };

  const handleHistoryChange = (newState: PreviewState) => {
    console.log('Parent - Received new code:', newState.code);
    setCode(newState.code);
    addToHistory(newState);
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
                onHistoryChange={handleHistoryChange}
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
      <AlertDialog open={isConfirmOpen} onOpenChange={(open) => {
        if (!open) {
          setIsConfirmOpen(false);
          setPendingType("");
          setPendingSampleCode("");
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Template Change</AlertDialogTitle>
            <AlertDialogDescription>
              Loading a new template will replace your current diagram. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setSelectedType(pendingType);
              setCode(pendingSampleCode);
              setIsConfirmOpen(false);
            }}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ErrorBoundary>
  )
}

