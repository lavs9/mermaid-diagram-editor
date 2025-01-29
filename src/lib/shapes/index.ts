import { basicShapes } from "./basic"
import { processShapes } from "./process"
import { technicalShapes } from "./technical"

export interface Shape {
  svg: string
  label: string
}

export interface ShapeLibrary {
  [key: string]: Shape
}

export interface ShapeCategories {
  [key: string]: ShapeLibrary
}

export const shapeLibrary: ShapeCategories = {
  basic: basicShapes,
  process: processShapes,
  technical: technicalShapes,
}

export const mermaidShapeTypes: {[key: string]: string} = {
  rectangle: 'rect',
  rounded: 'rounded',
  database: 'cylinder',
  stadium: 'stadium',
  diamond: 'rhombus',
  hexagon: 'hexagon',
  trapezoid: 'trapezoid'
};

export function getSvgFromString(svgString: string, className?: string): string {
  if (className) {
    return svgString.replace("<svg", `<svg class="${className}"`)
  }
  return svgString
}

export function getShapesByCategory(category: string): ShapeLibrary {
  return shapeLibrary[category] || {}
}

// Function to add custom shape
export function addCustomShape(category: string, name: string, svg: string, label: string) {
  if (!shapeLibrary[category]) {
    shapeLibrary[category] = {}
  }
  shapeLibrary[category][name] = { svg, label }
}

export function getShapeType(category: string, name: string): string {
  return mermaidShapeTypes[name] || 'rect';
}

export { convertNodesToCode } from './shapes';