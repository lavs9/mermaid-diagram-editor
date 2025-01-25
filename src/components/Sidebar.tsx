import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight, Settings, User, PanelLeftClose, PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"

// Chart types with their sample templates
const chartTypes = {
  flowchart: {
    name: "Flowchart",
    samples: [
      {
        name: "Basic Flow",
        code: `graph TD
    A[Start] --> B[Process]
    B --> C[End]`,
      },
      {
        name: "Complex Flow",
        code: `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process 1]
    B -->|No| D[Process 2]
    C --> E[End]
    D --> E`,
      },
    ],
  },
  sequence: {
    name: "Sequence Diagram",
    samples: [
      {
        name: "Basic Sequence",
        code: `sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob
    B->>A: Hi Alice`,
      },
      {
        name: "Complex Sequence",
        code: `sequenceDiagram
    participant A as Alice
    participant B as Bob
    participant C as Charlie
    A->>B: Hello Bob
    B->>C: Forward to Charlie
    C-->>B: Response
    B-->>A: Forward response`,
      },
    ],
  },
  class: {
    name: "Class Diagram",
    samples: [
      {
        name: "Basic Class",
        code: `classDiagram
    class Animal{
        +String name
        +move()
    }
    class Dog{
        +bark()
    }
    Animal <|-- Dog`,
      },
    ],
  },
  state: {
    name: "State Diagram",
    samples: [
      {
        name: "Basic State",
        code: `stateDiagram-v2
    [*] --> Still
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`,
      },
    ],
  },
  er: {
    name: "ER Diagram",
    samples: [
      {
        name: "Basic ER",
        code: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains`,
      },
    ],
  },
}

interface SidebarProps {
  onChartTypeSelect: (type: string, code: string) => void
  selectedType?: string
}

export function Sidebar({ onChartTypeSelect, selectedType }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <Card
      className={`relative h-full border-0 rounded-none transition-all duration-300 ${isCollapsed ? "w-12" : "w-64"}`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-2 z-10"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
      </Button>

      <ScrollArea className={`h-full ${isCollapsed ? "hidden" : ""}`}>
        <CardContent className="p-4 flex flex-col h-full">
          <div className="space-y-4">
            {Object.entries(chartTypes).map(([type, { name, samples }]) => (
              <div key={type} className="space-y-2">
                <Button
                  variant={selectedType === type ? "secondary" : "ghost"}
                  className="w-full justify-start font-medium"
                  onClick={() => onChartTypeSelect(type, "")} // Empty string to start fresh
                >
                  {name}
                </Button>
                <div className="pl-4 space-y-1">
                  {samples.map((sample, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-8 text-sm"
                      onClick={() => onChartTypeSelect(type, sample.code)}
                    >
                      {sample.name}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between h-8 px-2">
                <span className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Advanced Settings
                </span>
                {isSettingsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1">
              <Button variant="ghost" className="w-full justify-start h-8 px-2">
                Option 1
              </Button>
              <Button variant="ghost" className="w-full justify-start h-8 px-2">
                Option 2
              </Button>
              <Button variant="ghost" className="w-full justify-start h-8 px-2">
                Option 3
              </Button>
            </CollapsibleContent>
          </Collapsible>

          <Separator className="my-4" />

          <Link
            href="/profile"
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors mt-auto"
          >
            <User className="h-5 w-5" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium leading-none">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">john@example.com</p>
            </div>
          </Link>
        </CardContent>
      </ScrollArea>

      {isCollapsed && (
        <div className="p-2 flex flex-col items-center">
          {Object.entries(chartTypes)
            .slice(0, 5)
            .map(([type, { name }], index) => (
              <Button
                key={type}
                variant={selectedType === type ? "secondary" : "ghost"}
                size="icon"
                className="mb-2 h-8 w-8"
                onClick={() => onChartTypeSelect(type, "")}
              >
                <span className="sr-only">{name}</span>
                {index === 0 ? <Settings className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            ))}
        </div>
      )}
    </Card>
  )
}

