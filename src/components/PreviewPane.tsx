"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import mermaid from "mermaid"
import { Card } from "@/components/ui/card"
import { DiagramToolbar } from "./DiagramToolbar"
import { ZoomControls } from "./ZoomControls"
import { useUndo } from "@/hooks/use-undo"

interface PreviewPaneProps {
  code: string
  onHistoryChange: (code: string) => void
  onUndo: (updateState: (state: string) => void) => void
  onRedo: (updateState: (state: string) => void) => void
  canUndo: boolean
  canRedo: boolean
  onAddNode: (node: { id: string; type: string }, e: React.MouseEvent) => void
}

interface PreviewState {
  code: string
  scale: number
  position: { x: number; y: number }
}

export function PreviewPane({ code, onHistoryChange, onUndo, onRedo, canUndo, canRedo, onAddNode }: PreviewPaneProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [selectedTool, setSelectedTool] = useState("select")
  const [isPanning, setIsPanning] = useState(false)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const { canUndo: undoCanUndo, canRedo: undoCanRedo, undo, redo, addToHistory } = useUndo<PreviewState>({
    code,
    scale: 1,
    position: { x: 0, y: 0 }
  })

  const [isDragging, setIsDragging] = useState(false)
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })

  const handleZoom = useCallback((delta: number) => {
    setScale(s => Math.min(Math.max(s + delta, 0.1), 5))
  }, [])

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false })
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let shouldUpdateHistory = true
    
    const renderDiagram = async () => {
      try {
        if (controller.signal.aborted) return
        await mermaid.parse(code)
        if (!ref.current) return
        
        const { svg } = await mermaid.render("mermaid-diagram", code)
        ref.current.innerHTML = svg
        if (shouldUpdateHistory) {
          addToHistory({ code, scale, position })
        }
      } catch (error) {
        console.error("Error rendering diagram:", error)
        shouldUpdateHistory = false
      }
    }

    const timer = setTimeout(renderDiagram, 300)
    return () => {
      controller.abort()
      clearTimeout(timer)
      shouldUpdateHistory = false
    }
  }, [code, scale, position])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPanning) {
      setIsDragging(true)
      setStartPosition({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && isPanning) {
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    if (e.ctrlKey || e.metaKey) {
      handleZoom(e.deltaY > 0 ? -0.1 : 0.1)
    } else {
      setPosition(prev => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }))
    }
  }, [handleZoom])

  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
    addToHistory({ code, scale: 1, position: { x: 0, y: 0 } })
  }

  const handleUndoRedo = (state: PreviewState) => {
    setScale(state.scale)
    setPosition(state.position)
  }

  const handleUndo = () => onUndo((state) => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
    onHistoryChange(state)
  })

  const handleRedo = () => onRedo((state) => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
    onHistoryChange(state)
  })

  const parseNodesFromCode = (code: string) => {
    const nodes: Array<{id: string; type: string; x: number; y: number}> = [];
    const lines = code.split('\n');
    
    // Match node definitions like: nodeId["Label"]
    const nodeRegex = /^(\w+)\["(.+)"\]/;
    // Match shape definitions like: nodeId@{"shape": "rect"}
    const shapeRegex = /^(\w+)@\{"shape": "(\w+)"\}/;

    lines.forEach(line => {
      let match: RegExpMatchArray | null;
      if ((match = line.match(nodeRegex))) {
        nodes.push({
          id: match[1],
          type: match[2].toLowerCase(),
          x: 0,  // Default positions
          y: 0
        });
      }
      else if ((match = line.match(shapeRegex))) {
        const node = nodes.find(n => n.id === match![1]);
        if (node) {
          node.type = match![2];
        }
      }
    });

    return nodes;
  };

  const nodes = useMemo(() => parseNodesFromCode(code), [code]);

  return (
    <Card
      className="h-full w-full bg-background/50 rounded-none border-0 overflow-hidden relative"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px), radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)",
          backgroundSize: `${20 * scale}px ${20 * scale}px`,
          backgroundPosition: `${position.x % (20 * scale)}px ${position.y % (20 * scale)}px`,
        }}
      />
      <div
        ref={ref}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: "0 0",
          transition: isDragging ? "none" : "transform 0.1s ease-out",
        }}
        className="w-full h-full flex items-center justify-center"
      >
      </div>
      <DiagramToolbar 
        selectedTool={selectedTool} 
        onToolSelect={setSelectedTool}
        onAddNode={onAddNode}
      />
      <ZoomControls
        onZoomIn={() => handleZoom(0.1)}
        onZoomOut={() => handleZoom(-0.1)}
        onReset={handleReset}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onPan={() => setIsPanning(!isPanning)}
        canUndo={canUndo}
        canRedo={canRedo}
        isPanning={isPanning}
        scale={scale}
        className="z-20"
      />
    </Card>
  )
}

