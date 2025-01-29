interface ShapeToolbarProps {
  nodeId: string;
  onClose: () => void;
  style?: React.CSSProperties;
  onStyleChange: (style: string) => void;
}

export function ShapeToolbar({ nodeId, onClose, style, onStyleChange }: ShapeToolbarProps) {
  const borderOptions = [
    { label: 'Thin', width: '1px', style: 'solid' },
    { label: 'Normal', width: '2px', style: 'solid' },
    { label: 'Thick', width: '3px', style: 'solid' },
    { label: 'Thin Dashed', width: '1px', style: 'dashed' },
    { label: 'Normal Dashed', width: '2px', style: 'dashed' },
    { label: 'Thick Dashed', width: '3px', style: 'dashed' },
  ];

  const handleBorderChange = (borderWidth: string, borderStyle: string) => {
    const styleString = `stroke-width:${borderWidth},stroke-dasharray:${borderStyle === 'dashed' ? '5,5' : '0'}`;
    console.log('ShapeToolbar - Sending style update:', styleString);
    onStyleChange(styleString);
  };

  return (
    <div 
      className="absolute z-50 bg-background p-2 rounded-md shadow-lg border flex flex-col gap-2"
      style={style}
    >
      <div className="flex justify-between items-center">
        <span className="text-sm">Editing: {nodeId}</span>
        <button onClick={onClose} className="px-2 py-1 bg-muted rounded hover:bg-accent">
          ×
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-1">
        {borderOptions.map((option) => (
          <button
            key={option.label}
            onClick={() => handleBorderChange(option.width, option.style)}
            className="p-1 hover:bg-accent rounded flex flex-col items-center"
            title={option.label}
          >
            <svg width="60" height="30">
              <rect
                x="5" y="12"
                width="50" height="6"
                fill="none"
                stroke="#000"
                strokeWidth={option.width}
                strokeDasharray={option.style === 'dashed' ? '5' : '0'}
              />
            </svg>
            <span className="text-xs mt-1">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 