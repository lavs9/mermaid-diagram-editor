"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import mermaid from "mermaid"
import { Card } from "@/components/ui/card"
import { DiagramToolbar } from "./DiagramToolbar"
import { ZoomControls } from "./ZoomControls"
import { useUndo } from "@/hooks/use-undo"
import { Shape } from "./Shape"
import { convertNodesToCode } from "@/lib/shapes"
import { ShapeToolbar } from "./ShapeToolbar"


interface PreviewPaneProps {
  code: string
  onHistoryChange: (state: PreviewState) => void
  onUndo: (updateState: (state: PreviewState) => void) => void
  onRedo: (updateState: (state: PreviewState) => void) => void
  canUndo: boolean
  canRedo: boolean
  onAddNode: (node: { id: string; type: string }, e: React.MouseEvent) => void
}

interface PreviewState {
  code: string
  scale: number
  position: { x: number; y: number }
}

interface DiagramNode {
  id: string;
  type: string;
  x: number;
  y: number;
  label: string;
  fillColor?: string;
  borderWidth?: string;
  borderStyle?: string;
}


export function PreviewPane({ code, onHistoryChange, onUndo, onRedo, canUndo, canRedo, onAddNode }: PreviewPaneProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedTool, setSelectedTool] = useState("select")
  const [isPanning, setIsPanning] = useState(false)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const { canUndo: undoCanUndo, canRedo: undoCanRedo, undo, redo, addToHistory } = useUndo<PreviewState>({
    code: code,
    scale: 1,
    position: { x: 0, y: 0 }
  })

  const [isDragging, setIsDragging] = useState(false)
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)

  const [toolbarPosition, setToolbarPosition] = useState<{ x: number; y: number } | null>(null)

  const handleZoom = useCallback((delta: number) => {
    setScale(s => Math.min(Math.max(s + delta, 0.1), 5))
  }, [])

  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: false,
      securityLevel: 'loose',
      theme: 'neutral'
    });

    const renderDiagram = async () => {
      try {
        if (containerRef.current) {
          const { svg } = await mermaid.render('mermaid-svg', code);
          containerRef.current.innerHTML = svg;
          
          // Add click handlers to nodes
          const nodes = containerRef.current.querySelectorAll('.node');
          nodes.forEach(node => {
            node.addEventListener('click', (e) => {
              const target = e.currentTarget as HTMLElement;
              const rect = target.getBoundingClientRect();
              const rawId = target.id.replace(/^flowchart-/, '').replace(/-[0-9]+$/, '');
              const nodeId = rawId.startsWith('n') ? rawId : `n${rawId}`;
              
              setToolbarPosition({
                x: rect.left + rect.width/2 + window.scrollX,
                y: rect.top - 10 + window.scrollY
              });
              setSelectedNodeId(nodeId);
            });
          });
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err);
      }
    };

    renderDiagram();
  }, [code]);

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

  const handleUndo = () => onUndo((state: PreviewState) => {
    setScale(state.scale)
    setPosition(state.position)
    onHistoryChange(state)
  })

  const handleRedo = () => onRedo((state: PreviewState) => {
    setScale(state.scale)
    setPosition(state.position)
    onHistoryChange(state)
  })

  const parseNodesFromCode = (code: string) => {
    const nodes: Array<{
      id: string;
      type: string;
      x: number;
      y: number;
      label: string;
      fillColor?: string;
      borderWidth?: string;
      borderStyle?: string;
    }> = [];
    const lines = code.split('\n');
    
    // Match node definitions like: nodeId["Label"]
    const nodeRegex = /^(\w+)(?:\["(.+?)"\])?/;
    // Match shape definitions like: nodeId@{"shape": "rect"}
    const shapeRegex = /^(\w+)@\{"shape": "(\w+)"\}/;
    // Match style definitions like: style nodeId fill:#fff,stroke-width:2px
    const styleRegex = /^style (\w+) (.+)/;

    lines.forEach(line => {
      let match: RegExpMatchArray | null;
      if ((match = line.match(nodeRegex))) {
        const nodeId = match[1].startsWith('n') ? match[1] : `n${match[1]}`;
        // Check if node already exists
        if (!nodes.find(n => n.id === nodeId)) {
          nodes.push({
            id: nodeId,
            type: (match[2] || match[1]).toLowerCase(),
            x: 0,
            y: 0,
            label: match[2] || match[1]
          });
        }
      }
      else if ((match = line.match(shapeRegex))) {
        const node = nodes.find(n => n.id === match![1]);
        if (node) {
          node.type = match![2];
        }
      }
      else if ((match = line.match(styleRegex))) {
        const node = nodes.find(n => n.id === match![1]);
        if (node) {
          const styles = match![2].split(',');
          styles.forEach(style => {
            const [key, value] = style.split(':');
            if (key === 'fill') node.fillColor = value;
            if (key === 'stroke-width') node.borderWidth = value;
            if (key === 'stroke-dasharray') node.borderStyle = value !== '0' ? 'dashed' : 'solid';
          });
        }
      }
    });

    return nodes;
  };

  const nodes = useMemo(() => parseNodesFromCode(code), [code]);

  const handleTextChange = (id: string, newText: string) => {
    const lines = code.split('\n');
    const updatedCode = lines.map(line => {
      if (line.startsWith(`${id}[`)) {
        return `${id}["${newText}"]`;
      }
      return line;
    }).join('\n');
    
    onHistoryChange({
      code: updatedCode,
      scale,
      position
    });
  };

  const updateDiagramCode = (updatedNodes: Array<DiagramNode>) => {
    const newCode = convertNodesToCode(nodes.map(n => 
      updatedNodes.find(un => un.id === n.id) || n
    ));
    onHistoryChange({
      code: newCode,
      scale,
      position
    });
  };

  const toolbarX = 0;
  const toolbarY = 0;

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
        ref={containerRef}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: "0 0",
          transition: isDragging ? "none" : "transform 0.1s ease-out",
        }}
        className="w-full h-full flex items-center justify-center"
      />
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
      {selectedNodeId && toolbarPosition && (
        <ShapeToolbar 
          nodeId={selectedNodeId}
          onClose={() => {
            setSelectedNodeId(null);
            setToolbarPosition(null);
          }}
          onStyleChange={(styleUpdates) => {
            console.log('PreviewPane - Received style updates:', styleUpdates);
            const updates = new Map(styleUpdates.split(',').map(s => s.split(':') as [string, string]));
            
            const newLines = code.split('\n').map(line => {
              if (line.startsWith(`style ${selectedNodeId}`)) {
                const existing = new Map(line.split(' ')[2].split(',').map(s => s.split(':') as [string, string]));
                console.log('Existing styles:', Array.from(existing));
                updates.forEach((v, k) => existing.set(k, v));
                return `style ${selectedNodeId} ${Array.from(existing).map(([k,v]) => `${k}:${v}`).join(',')}`;
              }
              return line;
            });

            if (!newLines.some(line => line.startsWith(`style ${selectedNodeId}`))) {
              console.log('Adding new style line');
              newLines.push(`style ${selectedNodeId} ${styleUpdates}`);
            }

            const newCode = newLines.join('\n');
            console.log('Final code to save:', newCode);
            onHistoryChange({ code: newCode, scale, position });
          }}
          style={{
            position: 'fixed',
            left: toolbarPosition.x,
            top: toolbarPosition.y,
            transform: 'translateX(-50%)'
          }}
        />
      )}
    </Card>
  )
}

