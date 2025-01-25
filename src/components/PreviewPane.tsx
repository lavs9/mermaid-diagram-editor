"use client"

import { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"
import { Card } from "@/components/ui/card"
import { DiagramToolbar } from "./DiagramToolbar"
import { ZoomControls } from "./ZoomControls"
import { useUndo } from "@/hooks/use-undo"

interface PreviewPaneProps {
  code: string
}

export function PreviewPane({ code }: PreviewPaneProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [selectedTool, setSelectedTool] = useState("select")
  const [isPanning, setIsPanning] = useState(false)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const { canUndo, canRedo, undo, redo, addToHistory } = useUndo<string>(code)

  const [isDragging, setIsDragging] = useState(false)
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (ref.current) {
      mermaid.initialize({ startOnLoad: false })
      mermaid.render("mermaid-diagram", code).then((result) => {
        if (ref.current) {
          ref.current.innerHTML = result.svg
          addToHistory(code)
        }
      })
    }
  }, [code, addToHistory])

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

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      setScale((s) => Math.min(Math.max(s + delta, 0.1), 5))
    } else {
      // Pan
      setPosition((prev) => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }))
    }
  }

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.1, 5))
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.1, 0.1))
  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  return (
    <Card
      className="relative w-full h-full bg-background/50 rounded-none border-0 overflow-hidden"
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
      />
      <DiagramToolbar selectedTool={selectedTool} onToolSelect={setSelectedTool} />
      <ZoomControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        onUndo={undo}
        onRedo={redo}
        onPan={() => setIsPanning(!isPanning)}
        canUndo={canUndo}
        canRedo={canRedo}
        isPanning={isPanning}
        scale={scale}
      />
    </Card>
  )
}

