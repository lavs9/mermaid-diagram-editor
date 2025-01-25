import { Play, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ToolbarProps {
//  onRun: () => void
  onExport: (format: string) => void
}

export function Toolbar({onExport }: ToolbarProps) {
  return (
    <div className="flex items-center justify-between p-2 bg-background border-b">
      <div className="flex items-center space-x-2">
        {/* <Button onClick={onRun} size="sm">
          <Play className="mr-2 h-4 w-4" />
          Run
        </Button> */}
        <Select onValueChange={onExport}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Export" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="svg">SVG</SelectItem>
            <SelectItem value="embed">Embed Code</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

