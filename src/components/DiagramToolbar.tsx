import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MousePointer, Plus, Type, Box, Smile } from "lucide-react"
import { getShapesByCategory, getSvgFromString } from "@/lib/shapes"

interface DiagramToolbarProps {
  onToolSelect: (tool: string) => void
  selectedTool: string
  onAddNode: (
    node: { id: string; type: string; x: number; y: number },
    e: React.MouseEvent
  ) => void
}

const categories = ["basic", "process", "technical"]

export function DiagramToolbar({ onToolSelect, selectedTool, onAddNode }: DiagramToolbarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("basic")

  const shapes = getShapesByCategory(activeTab)
  const filteredShapes = Object.entries(shapes).filter(([name, shape]) =>
    shape.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <TooltipProvider delayDuration={0}>
      <div className="absolute top-4 left-4 z-10">
        <ToggleGroup type="single" value={selectedTool} onValueChange={onToolSelect} orientation="vertical">
          <ToggleGroupItem value="select" size="sm" className="data-[state=on]:bg-accent">
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <MousePointer className="h-4 w-4" />
                  <span className="sr-only">Select</span>
                </span>
              </TooltipTrigger>
              <TooltipContent side="right">Select</TooltipContent>
            </Tooltip>
          </ToggleGroupItem>
          <Popover>
            <PopoverTrigger asChild>
              <ToggleGroupItem value="node" size="sm" className="data-[state=on]:bg-accent">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Add Node</span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right">Add Node</TooltipContent>
                </Tooltip>
              </ToggleGroupItem>
            </PopoverTrigger>
            <PopoverContent side="right" className="w-80">
              <Tabs defaultValue="basic" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="process">Process</TabsTrigger>
                  <TabsTrigger value="technical">Technical</TabsTrigger>
                </TabsList>
                <Input
                  placeholder="Search shapes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="my-2"
                />
                <ScrollArea className="h-72">
                  <div className="grid grid-cols-4 gap-1 p-1">
                    {filteredShapes.map(([name, shape]) => (
                      <div key={name} className="relative group">
                        <div
                          role="button"
                          tabIndex={0}
                          aria-label={shape.label}
                          data-shape={shape.label}
                          className="shape-popup-item rounded-md bg-surface-50 hover:bg-primary-200 dark:hover:bg-surface-600 p-2 h-12 w-12 flex items-center justify-center"
                          onClick={(e) => {
                            onAddNode({
                              id: `node_${Date.now()}`,
                              type: name,
                              x: e.clientX - 100,
                              y: e.clientY - 50
                            }, e);
                            onToolSelect("select");
                          }}
                        >
                          <div
                            dangerouslySetInnerHTML={{
                              __html: getSvgFromString(
                                shape.svg, 
                                "h-12 w-12 dark:bg-white dark:text-primary-500"
                              )
                            }}
                          />
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block z-50">
                          <div className="relative bg-black text-white text-xs rounded-md py-1 px-2 shadow-md">
                            {shape.label}
                            <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-black rotate-45" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Tabs>
            </PopoverContent>
          </Popover>
          <ToggleGroupItem value="text" size="sm" className="data-[state=on]:bg-accent">
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Type className="h-4 w-4" />
                  <span className="sr-only">Add Text</span>
                </span>
              </TooltipTrigger>
              <TooltipContent side="right">Add Text</TooltipContent>
            </Tooltip>
          </ToggleGroupItem>
          <ToggleGroupItem value="subgraph" size="sm" className="data-[state=on]:bg-accent">
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Box className="h-4 w-4" />
                  <span className="sr-only">Add Subgraph</span>
                </span>
              </TooltipTrigger>
              <TooltipContent side="right">Add Subgraph</TooltipContent>
            </Tooltip>
          </ToggleGroupItem>
          <Popover>
            <PopoverTrigger asChild>
              <ToggleGroupItem value="icon" size="sm" className="data-[state=on]:bg-accent">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Smile className="h-4 w-4" />
                      <span className="sr-only">Add Icon</span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right">Add Icon</TooltipContent>
                </Tooltip>
              </ToggleGroupItem>
            </PopoverTrigger>
            <PopoverContent side="right" className="w-80">
              <Input
                placeholder="Search icons..."
                className="mb-2"
                // TODO: Implement icon search functionality
              />
              <ScrollArea className="h-72">
                <div className="grid grid-cols-6 gap-2">{/* TODO: Add Mermaid-supported icons/emojis here */}</div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </ToggleGroup>
      </div>
    </TooltipProvider>
  )
}

