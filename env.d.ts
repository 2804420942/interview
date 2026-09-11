/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'dagre' {
  const dagre: {
    graphlib: {
      Graph: new (opts?: { compound?: boolean; directed?: boolean; multigraph?: boolean }) => {
        setGraph(opts: Record<string, any>): void
        setDefaultEdgeLabel(fn: () => Record<string, any>): void
        setNode(id: string, opts: Record<string, any>): void
        setEdge(from: string, to: string, opts?: Record<string, any>): void
        setParent(child: string, parent: string): void
        node(id: string): any
        edge(from: string, to: string): any
        graph(): any
        nodes(): string[]
        edges(): { v: string; w: string }[]
      }
    }
    layout(g: any): void
  }
  export default dagre
}