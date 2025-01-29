export function convertNodesToCode(nodes: Array<{
  id: string;
  type: string;
  fillColor?: string;
  borderWidth?: string;
  borderStyle?: string;
}>) {
  const shapeMap: {[key: string]: string} = {
    rectangle: 'rect',
    rounded: 'rounded',
    circle: 'circle',
    stadium: 'stadium'
  };

  let codeLines: string[] = [];
  nodes.forEach(node => {
    codeLines.push(`${node.id}["${node.type}"]`);
    codeLines.push(`${node.id}@{"shape": "${shapeMap[node.type] || 'rect'}"}`);
    
    if(node.fillColor || node.borderWidth || node.borderStyle) {
      const styles = [
        node.fillColor && `fill:${node.fillColor}`,
        node.borderWidth && `stroke-width:${node.borderWidth}`,
        node.borderStyle && `stroke-dasharray:${node.borderStyle === 'dashed' ? '5,5' : '0'}`
      ].filter(Boolean).join(',');
      
      codeLines.push(`style ${node.id} ${styles}`);
    }
  });
  return codeLines.join('\n');
} 