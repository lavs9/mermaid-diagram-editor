import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Separator } from "@/components/ui/separator"
import { ZoomIn, ZoomOut, Maximize, RotateCcw, RotateCw, Move } from "lucide-react"

interface ZoomControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  onUndo: () => void
  onRedo: () => void
  onPan: () => void
  canUndo: boolean
  canRedo: boolean
  isPanning: boolean
  scale: number
}

export function ZoomControls({
  onZoomIn,
  onZoomOut,
  onReset,
  onUndo,
  onRedo,
  onPan,
  canUndo,
  canRedo,
  isPanning,
  scale,
}: ZoomControlsProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border p-1">
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onUndo} disabled={!canUndo} className="h-8 w-8">
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">Undo</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onRedo} disabled={!canRedo} className="h-8 w-8">
                <RotateCw className="h-4 w-4" />
                <span className="sr-only">Redo</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </div>
        <Separator orientation="vertical" className="h-8" />
        <ToggleGroup type="single" value={isPanning ? "pan" : ""}>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="pan" size="sm" onClick={() => onPan()} className="h-8 w-8">
                <Move className="h-4 w-4" />
                <span className="sr-only">Pan</span>
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Pan</TooltipContent>
          </Tooltip>
        </ToggleGroup>
        <Separator orientation="vertical" className="h-8" />
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onZoomIn} className="h-8 w-8">
                <ZoomIn className="h-4 w-4" />
                <span className="sr-only">Zoom In</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom In</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onZoomOut} className="h-8 w-8">
                <ZoomOut className="h-4 w-4" />
                <span className="sr-only">Zoom Out</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom Out</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onReset} className="h-8 w-8">
                <Maximize className="h-4 w-4" />
                <span className="sr-only">Reset Zoom</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset View</TooltipContent>
          </Tooltip>
        </div>
        <Separator orientation="vertical" className="h-8" />
        <div className="px-2 text-sm font-medium">{Math.round(scale * 100)}%</div>
      </div>
    </TooltipProvider>
  )
}

