import EditableText from './EditableText';
import { useState, useRef } from 'react';
import { Droplet, PenLine, Square } from 'lucide-react';
import { getSvgFromString } from "../lib/shapes"
import { shapeLibrary } from "../lib/shapes/index"
import { Button } from '../components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../components/ui/select';


interface ShapeProps {
  shapeData: { 
    id: string; 
    label: string;
    fillColor?: string;
    borderWidth?: string;
    borderStyle?: string;
    type?: string;
  };
  onTextChange: (id: string, newText: string) => void;
  onStyleChange: (id: string, style: {
    fillColor?: string;
    borderWidth?: string;
    borderStyle?: string;
    type?: string;
  }) => void;
  isSelected?: boolean;
}

export const Shape = ({ shapeData, onTextChange, onStyleChange, isSelected }: ShapeProps) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [localLabel, setLocalLabel] = useState(shapeData.label);

  const colors = ['#ffffff', '#ffebee', '#f3e5f5', '#e3f2fd', '#e0f2f1', '#fbe9e7'];
  const borders = ['1px', '2px', '3px'];
  const borderStyles = ['solid', 'dashed'];
  const containerRef = useRef<HTMLDivElement>(null);
  const rect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };

  console.log('Rendering Shape with selection:', isSelected);
  console.log('Toolbar render state - isSelected:', isSelected);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center"
      style={{
        width: '100%',
        height: '100%',
        outline: isSelected ? '2px solid #3b82f6' : undefined
      }}
    >
      {isSelected && (
        <div 
          className="fixed flex gap-1 p-1 bg-background rounded-md shadow-lg border z-50"
          style={{ 
            left: rect.left + window.scrollX + rect.width/2,
            top: rect.top + window.scrollY + rect.height + 10
          }}
        >
          <Popover>
            <PopoverTrigger>
              <Button variant="ghost" size="sm">
                <Square className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(shapeLibrary.basic).map(([name, shape]) => (
                  <div
                    key={name}
                    className="cursor-pointer p-1 hover:bg-accent rounded"
                    onClick={() => onStyleChange(shapeData.id, { type: name })}
                    dangerouslySetInnerHTML={{ __html: getSvgFromString(shape.svg) }}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger>
              <Button variant="ghost" size="sm">
                <Droplet className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-32">
              <div className="grid grid-cols-3 gap-2">
                {colors.map(color => (
                  <div
                    key={color}
                    className="h-6 w-6 rounded-full border cursor-pointer"
                    style={{ backgroundColor: color }}
                    onClick={() => onStyleChange(shapeData.id, { fillColor: color })}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Select
            onValueChange={(value) => {
              const [width, style] = value.split('-');
              onStyleChange(shapeData.id, { 
                borderWidth: width,
                borderStyle: style
              });
            }}
          >
            <SelectTrigger className="w-[120px]">
              <PenLine className="h-4 w-4 mr-2" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1px-solid">Thin Solid</SelectItem>
              <SelectItem value="2px-solid">Normal Solid</SelectItem>
              <SelectItem value="3px-solid">Thick Solid</SelectItem>
              <SelectItem value="1px-dashed">Thin Dashed</SelectItem>
              <SelectItem value="2px-dashed">Normal Dashed</SelectItem>
              <SelectItem value="3px-dashed">Thick Dashed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div
        className={`p-2 border rounded ${isSelected ? 'ring-2 ring-primary' : ''}`}
        style={{
          backgroundColor: shapeData.fillColor,
          borderWidth: shapeData.borderWidth || '1px',
          borderStyle: shapeData.borderStyle || 'solid'
        }}
      >
        <EditableText 
          initialText={localLabel}
          onTextChange={(newText) => {
            setLocalLabel(newText);
            onTextChange(shapeData.id, newText);
          }}
        />
      </div>
    </div>
  );
}; 