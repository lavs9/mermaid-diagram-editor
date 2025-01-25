import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MousePointer, Plus, Type, Box, Smile } from "lucide-react"

interface DiagramToolbarProps {
  onToolSelect: (tool: string) => void
  selectedTool: string
}

const shapes = {
  basic: ["rectangle", "rounded", "circle", "rhombus", "hexagon", "parallelogram"],
  process: ["rectangle", "stadium", "subroutine", "database", "queue", "storage"],
  technical: ["cylinder", "diamond", "hexagon", "trapezoid", "step", "document"],
}

export function DiagramToolbar({ onToolSelect, selectedTool }: DiagramToolbarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("basic")

  const filteredShapes = shapes[activeTab as keyof typeof shapes].filter((shape) =>
    shape.toLowerCase().includes(searchTerm.toLowerCase()),
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
                  <div className="grid grid-cols-3 gap-2 p-2">
                    {filteredShapes.map((shape) => (
                      <Button
                        key={shape}
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center"
                        onClick={() => {
                          onToolSelect("node")
                          // TODO: Add logic to insert the selected shape
                        }}
                      >
                        <div className="w-12 h-12 border-2 border-foreground flex items-center justify-center">
                          {/* Placeholder for shape icon */}
                        </div>
                        <span className="text-xs mt-1">{shape}</span>
                      </Button>
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

