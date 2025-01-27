# Mermaid Diagram Editor

A visual editor for creating and editing Mermaid.js diagrams with real-time preview and export capabilities.

![Demo Preview](https://via.placeholder.com/800x500.png?text=Mermaid+Editor+Preview)

## Features

- **Visual Diagram Editing**
  - Add nodes/shapes through toolbar
  - Drag-to-pan and zoom controls
  - Undo/redo functionality
- **Real-time Preview**
  - Instant Mermaid.js rendering
  - Syntax validation
- **Multiple Export Options**
  - PNG/SVG image export
  - Embed code generation
- **Template Library**
  - Pre-built templates for common diagrams
  - Sample flows for quick starts
- **Responsive Design**
  - Adjustable split-pane layout
  - Dark/light theme support

## Technologies

- React + Next.js
- Mermaid.js (v11+)
- Shadcn UI Components
- CodeMirror Editor
- use-undo for history management

## Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### Installation

Install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm dev
# or
bun dev
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Running Locally
1. Access the editor at `http://localhost:3000`
2. Use the left sidebar to select diagram templates
3. Edit code in the left panel or add nodes visually.
4. Preview updates automatically in the right panel
5. Export diagrams using the toolbar options


This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
