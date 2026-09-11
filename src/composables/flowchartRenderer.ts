/**
 * 基于 dagre 布局引擎的自定义 SVG 流程图渲染器
 * 替代 Mermaid，解决重复节点、连线丢失、文字消失等问题
 */
import dagre from 'dagre'
import type { FlowchartData, FlowNode, FlowSubgraph } from './flowchartParser'

interface LayoutNode {
  id: string
  x: number
  y: number
  width: number
  height: number
  label: string
  shape: FlowNode['shape']
}

interface LayoutEdge {
  from: string
  to: string
  label?: string
  points: { x: number; y: number }[]
}

interface LayoutSubgraph {
  id: string
  label: string
  x: number
  y: number
  width: number
  height: number
}

// 颜色主题
const LIGHT_THEME = {
  nodeFill: '#f0fdf4',
  nodeStroke: '#22c55e',
  nodeText: '#15803d',
  edgeStroke: '#94a3b8',
  edgeArrow: '#64748b',
  edgeLabel: '#64748b',
  subgraphFill: 'rgba(0, 220, 130, 0.04)',
  subgraphStroke: 'rgba(0, 220, 130, 0.25)',
  subgraphLabel: '#6b7280',
  bgColor: '#ffffff',
}

const DARK_THEME = {
  nodeFill: 'rgba(0, 220, 130, 0.08)',
  nodeStroke: '#00DC82',
  nodeText: '#a7f3d0',
  edgeStroke: '#475569',
  edgeArrow: '#64748b',
  edgeLabel: '#94a3b8',
  subgraphFill: 'rgba(0, 220, 130, 0.04)',
  subgraphStroke: 'rgba(0, 220, 130, 0.15)',
  subgraphLabel: '#9ca3af',
  bgColor: '#0B0F19',
}

// 子图颜色方案（用于区分不同子图）
const SUBGRAPH_COLORS_LIGHT = [
  { fill: 'rgba(59, 130, 246, 0.04)', stroke: 'rgba(59, 130, 246, 0.25)', label: '#3b82f6' },
  { fill: 'rgba(168, 85, 247, 0.04)', stroke: 'rgba(168, 85, 247, 0.25)', label: '#a855f7' },
  { fill: 'rgba(236, 72, 153, 0.04)', stroke: 'rgba(236, 72, 153, 0.25)', label: '#ec4899' },
  { fill: 'rgba(245, 158, 11, 0.04)', stroke: 'rgba(245, 158, 11, 0.25)', label: '#f59e0b' },
  { fill: 'rgba(0, 220, 130, 0.04)', stroke: 'rgba(0, 220, 130, 0.25)', label: '#00DC82' },
]

const SUBGRAPH_COLORS_DARK = [
  { fill: 'rgba(59, 130, 246, 0.06)', stroke: 'rgba(59, 130, 246, 0.3)', label: '#60a5fa' },
  { fill: 'rgba(168, 85, 247, 0.06)', stroke: 'rgba(168, 85, 247, 0.3)', label: '#c084fc' },
  { fill: 'rgba(236, 72, 153, 0.06)', stroke: 'rgba(236, 72, 153, 0.3)', label: '#f472b6' },
  { fill: 'rgba(245, 158, 11, 0.06)', stroke: 'rgba(245, 158, 11, 0.3)', label: '#fbbf24' },
  { fill: 'rgba(0, 220, 130, 0.06)', stroke: 'rgba(0, 220, 130, 0.3)', label: '#34d399' },
]

// 节点颜色方案（根据所属子图着色）
const NODE_COLORS_LIGHT = [
  { fill: '#eff6ff', stroke: '#3b82f6', text: '#1d4ed8' },
  { fill: '#faf5ff', stroke: '#a855f7', text: '#7c3aed' },
  { fill: '#fdf2f8', stroke: '#ec4899', text: '#be185d' },
  { fill: '#fffbeb', stroke: '#f59e0b', text: '#b45309' },
  { fill: '#f0fdf4', stroke: '#22c55e', text: '#15803d' },
]

const NODE_COLORS_DARK = [
  { fill: 'rgba(59, 130, 246, 0.1)', stroke: '#3b82f6', text: '#93c5fd' },
  { fill: 'rgba(168, 85, 247, 0.1)', stroke: '#a855f7', text: '#d8b4fe' },
  { fill: 'rgba(236, 72, 153, 0.1)', stroke: '#ec4899', text: '#f9a8d4' },
  { fill: 'rgba(245, 158, 11, 0.1)', stroke: '#f59e0b', text: '#fde68a' },
  { fill: 'rgba(0, 220, 130, 0.1)', stroke: '#00DC82', text: '#a7f3d0' },
]

/**
 * 测量文本宽度（近似）
 */
function measureText(text: string, fontSize: number = 12): number {
  const lines = text.split('\n')
  let maxWidth = 0
  for (const line of lines) {
    let width = 0
    for (const char of line) {
      // 中文字符宽度约为字体大小，英文约为 0.6 倍
      if (/[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/.test(char)) {
        width += fontSize * 0.95
      } else {
        width += fontSize * 0.6
      }
    }
    maxWidth = Math.max(maxWidth, width)
  }
  return maxWidth
}

/**
 * 计算节点尺寸
 */
function calcNodeSize(node: FlowNode): { width: number; height: number } {
  const lines = node.label.split('\n')
  const textWidth = measureText(node.label, 12)
  const textHeight = lines.length * 18
  const paddingX = 28
  const paddingY = 16

  let width = Math.max(textWidth + paddingX * 2, 80)
  let height = textHeight + paddingY * 2

  if (node.shape === 'diamond') {
    width = Math.max(width * 1.4, 100)
    height = Math.max(height * 1.4, 60)
  }

  return { width: Math.ceil(width), height: Math.ceil(height) }
}

/**
 * 获取节点所属子图的索引
 */
function getNodeSubgraphIndex(nodeId: string, subgraphs: FlowSubgraph[]): number {
  for (let i = 0; i < subgraphs.length; i++) {
    if (subgraphs[i].nodeIds.includes(nodeId)) return i
  }
  return -1
}

/**
 * 使用 dagre 进行布局计算
 */
function layoutGraph(data: FlowchartData): {
  nodes: LayoutNode[]
  edges: LayoutEdge[]
  subgraphs: LayoutSubgraph[]
  width: number
  height: number
} {
  const g = new dagre.graphlib.Graph({ compound: true })

  // 根据图的复杂度动态调整间距
  const edgeCount = data.edges.length
  const nodeCount = data.nodes.length
  // 计算扇出度：同一个源节点连接多个目标的情况
  const fanOutMap = new Map<string, number>()
  for (const edge of data.edges) {
    fanOutMap.set(edge.from, (fanOutMap.get(edge.from) || 0) + 1)
  }
  const maxFanOut = Math.max(...Array.from(fanOutMap.values()), 1)
  // 计算扇入度：同一个目标节点被多个源连接的情况
  const fanInMap = new Map<string, number>()
  for (const edge of data.edges) {
    fanInMap.set(edge.to, (fanInMap.get(edge.to) || 0) + 1)
  }
  const maxFanIn = Math.max(...Array.from(fanInMap.values()), 1)

  // 复杂图需要更大的间距来避免连线交叉
  const subgraphCount = data.subgraphs.length
  const isComplex = edgeCount > 10 || maxFanOut > 3 || maxFanIn > 3 || nodeCount > 20 || subgraphCount > 3
  const isVeryComplex = edgeCount > 20 || nodeCount > 25 || subgraphCount > 4

  let nodesep = 35
  let ranksep = 55
  let edgesep = 18
  if (isVeryComplex) {
    nodesep = Math.min(60 + maxFanOut * 10 + subgraphCount * 5, 140)
    ranksep = Math.min(70 + maxFanOut * 8 + subgraphCount * 5, 130)
    edgesep = Math.min(25 + maxFanOut * 5, 60)
  } else if (isComplex) {
    nodesep = Math.min(50 + maxFanOut * 8, 110)
    ranksep = Math.min(60 + maxFanOut * 5, 100)
    edgesep = Math.min(20 + maxFanOut * 5, 50)
  }

  g.setGraph({
    rankdir: data.direction,
    nodesep,
    ranksep,
    edgesep,
    marginx: 40,
    marginy: 40,
  })
  g.setDefaultEdgeLabel(() => ({}))

  // 添加子图作为 compound 节点
  for (const sg of data.subgraphs) {
    g.setNode(sg.id, { label: sg.label, clusterLabelPos: 'top', style: 'fill: none' })
  }

  // 添加节点
  for (const node of data.nodes) {
    const size = calcNodeSize(node)
    g.setNode(node.id, { label: node.label, width: size.width, height: size.height })

    // 设置父子关系
    for (const sg of data.subgraphs) {
      if (sg.nodeIds.includes(node.id)) {
        g.setParent(node.id, sg.id)
        break
      }
    }
  }

  // 添加边
  for (const edge of data.edges) {
    g.setEdge(edge.from, edge.to, { label: edge.label || '' })
  }

  // 执行布局
  dagre.layout(g)

  // 提取布局结果
  const layoutNodes: LayoutNode[] = []
  const layoutEdges: LayoutEdge[] = []
  const layoutSubgraphs: LayoutSubgraph[] = []

  for (const node of data.nodes) {
    const n = g.node(node.id)
    if (n) {
      layoutNodes.push({
        id: node.id,
        x: n.x,
        y: n.y,
        width: n.width,
        height: n.height,
        label: node.label,
        shape: node.shape,
      })
    }
  }

  for (const edge of data.edges) {
    const e = g.edge(edge.from, edge.to)
    if (e && e.points) {
      layoutEdges.push({
        from: edge.from,
        to: edge.to,
        label: edge.label,
        points: e.points,
      })
    }
  }

  // 计算子图边界
  for (const sg of data.subgraphs) {
    const sgNodePositions = sg.nodeIds
      .map(id => layoutNodes.find(n => n.id === id))
      .filter(Boolean) as LayoutNode[]

    if (sgNodePositions.length > 0) {
      const padding = 40
      const labelHeight = 30
      const minX = Math.min(...sgNodePositions.map(n => n.x - n.width / 2)) - padding
      const maxX = Math.max(...sgNodePositions.map(n => n.x + n.width / 2)) + padding
      const minY = Math.min(...sgNodePositions.map(n => n.y - n.height / 2)) - padding - labelHeight
      const maxY = Math.max(...sgNodePositions.map(n => n.y + n.height / 2)) + padding

      layoutSubgraphs.push({
        id: sg.id,
        label: sg.label,
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
      })
    }
  }

  const graphInfo = g.graph()
  return {
    nodes: layoutNodes,
    edges: layoutEdges,
    subgraphs: layoutSubgraphs,
    width: (graphInfo.width || 800) + 60,
    height: (graphInfo.height || 600) + 60,
  }
}

/**
 * 生成节点的 SVG 路径
 */
function renderNodeShape(node: LayoutNode, fill: string, stroke: string): string {
  const { x, y, width, height, shape } = node
  const hw = width / 2
  const hh = height / 2

  switch (shape) {
    case 'round':
      return `<rect x="${x - hw}" y="${y - hh}" width="${width}" height="${height}" rx="${height / 2}" ry="${height / 2}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`
    case 'diamond':
      return `<polygon points="${x},${y - hh} ${x + hw},${y} ${x},${y + hh} ${x - hw},${y}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`
    case 'hexagon':
      const indent = 12
      return `<polygon points="${x - hw + indent},${y - hh} ${x + hw},${y - hh} ${x + hw - indent},${y + hh} ${x - hw},${y + hh}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`
    case 'stadium':
      return `<rect x="${x - hw}" y="${y - hh}" width="${width}" height="${height}" rx="${height / 2}" ry="${height / 2}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`
    case 'rect':
    default:
      return `<rect x="${x - hw}" y="${y - hh}" width="${width}" height="${height}" rx="6" ry="6" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`
  }
}

/**
 * 生成边的 SVG 路径（使用三次贝塞尔曲线实现平滑连线）
 */
function renderEdgePath(edge: LayoutEdge): string {
  if (edge.points.length < 2) return ''

  const pts = edge.points

  if (pts.length === 2) {
    // 两点之间使用直线
    return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`
  }

  // 使用 Catmull-Rom 样条转三次贝塞尔曲线，产生更平滑的路径
  let d = `M ${pts[0].x} ${pts[0].y}`

  if (pts.length === 3) {
    // 三个点使用二次贝塞尔曲线
    const cp = pts[1]
    const end = pts[2]
    d += ` Q ${cp.x} ${cp.y} ${end.x} ${end.y}`
  } else {
    // 多个点使用三次贝塞尔曲线连接
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)]
      const p1 = pts[i]
      const p2 = pts[Math.min(pts.length - 1, i + 1)]
      const p3 = pts[Math.min(pts.length - 1, i + 2)]

      if (i === 0) {
        // 第一段：起点到第一个中间点
        const cp1x = p1.x + (p2.x - p0.x) / 6
        const cp1y = p1.y + (p2.y - p0.y) / 6
        const cp2x = p2.x - (p3.x - p1.x) / 6
        const cp2y = p2.y - (p3.y - p1.y) / 6
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
      } else if (i < pts.length - 2) {
        const cp1x = p1.x + (p2.x - p0.x) / 6
        const cp1y = p1.y + (p2.y - p0.y) / 6
        const cp2x = p2.x - (p3.x - p1.x) / 6
        const cp2y = p2.y - (p3.y - p1.y) / 6
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
      }
    }
    // 最后一段连接到终点
    const last = pts[pts.length - 1]
    const secondLast = pts[pts.length - 2]
    if (Math.abs(last.x - secondLast.x) > 1 || Math.abs(last.y - secondLast.y) > 1) {
      d += ` L ${last.x} ${last.y}`
    }
  }

  return d
}

/**
 * 生成箭头标记
 */
function renderArrowMarker(id: string, color: string): string {
  return `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M 0 0 L 10 5 L 0 10 z" fill="${color}"/>
  </marker>`
}

/**
 * SVG 文本转义
 */
function svgEscape(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * 渲染多行文本
 */
function renderMultilineText(
  x: number,
  y: number,
  text: string,
  fontSize: number,
  fill: string,
  fontWeight: string = 'normal'
): string {
  const lines = text.split('\n')
  const lineHeight = fontSize + 6
  const startY = y - ((lines.length - 1) * lineHeight) / 2

  return lines
    .map(
      (line, i) =>
        `<text x="${x}" y="${startY + i * lineHeight}" text-anchor="middle" dominant-baseline="central" font-size="${fontSize}" font-weight="${fontWeight}" fill="${fill}" font-family="Inter, system-ui, -apple-system, sans-serif">${svgEscape(line)}</text>`
    )
    .join('\n')
}

/**
 * 主渲染函数：将 FlowchartData 渲染为 SVG 字符串
 */
export function renderFlowchartSVG(data: FlowchartData, isDark: boolean = false): string {
  const theme = isDark ? DARK_THEME : LIGHT_THEME
  const sgColors = isDark ? SUBGRAPH_COLORS_DARK : SUBGRAPH_COLORS_LIGHT
  const nodeColors = isDark ? NODE_COLORS_DARK : NODE_COLORS_LIGHT

  const layout = layoutGraph(data)
  const { nodes, edges, subgraphs, width, height } = layout

  const uid = `fc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const arrowId = `arrow-${uid}`

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="font-family: Inter, system-ui, -apple-system, sans-serif;">\n`

  // Defs: 箭头标记
  svg += `<defs>\n`
  svg += renderArrowMarker(arrowId, theme.edgeArrow)
  // 为每个子图颜色创建箭头
  sgColors.forEach((c, i) => {
    svg += renderArrowMarker(`${arrowId}-${i}`, c.stroke)
  })
  svg += `</defs>\n`

  // 渲染子图背景
  for (let i = 0; i < subgraphs.length; i++) {
    const sg = subgraphs[i]
    const color = sgColors[i % sgColors.length]
    svg += `<g class="subgraph">\n`
    svg += `  <rect x="${sg.x}" y="${sg.y}" width="${sg.width}" height="${sg.height}" rx="12" ry="12" fill="${color.fill}" stroke="${color.stroke}" stroke-width="1.5" stroke-dasharray="6 3"/>\n`
    svg += `  <text x="${sg.x + 14}" y="${sg.y + 18}" font-size="11" font-weight="600" fill="${color.label}" font-family="Inter, system-ui, -apple-system, sans-serif">${svgEscape(sg.label)}</text>\n`
    svg += `</g>\n`
  }

  // 渲染边 - 根据边的密度动态调整样式
  const totalEdges = edges.length
  // 密集图使用更细的线条和更低的透明度
  const edgeStrokeWidth = totalEdges > 20 ? 1 : totalEdges > 12 ? 1.2 : 1.5
  const edgeOpacity = totalEdges > 20 ? 0.45 : totalEdges > 12 ? 0.55 : 0.7

  for (const edge of edges) {
    const path = renderEdgePath(edge)
    if (!path) continue

    // 确定边的颜色（根据起始节点所属子图）
    const fromSgIdx = getNodeSubgraphIndex(edge.from, data.subgraphs)
    const edgeColor = fromSgIdx >= 0 ? sgColors[fromSgIdx % sgColors.length].stroke : theme.edgeStroke
    const arrowRef = fromSgIdx >= 0 ? `${arrowId}-${fromSgIdx % sgColors.length}` : arrowId

    svg += `<g class="edge">\n`
    svg += `  <path d="${path}" fill="none" stroke="${edgeColor}" stroke-width="${edgeStrokeWidth}" marker-end="url(#${arrowRef})" opacity="${edgeOpacity}" stroke-linecap="round" stroke-linejoin="round"/>\n`

    // 边标签
    if (edge.label) {
      const midIdx = Math.floor(edge.points.length / 2)
      const midPt = edge.points[midIdx]
      svg += `  <rect x="${midPt.x - measureText(edge.label, 10) / 2 - 6}" y="${midPt.y - 9}" width="${measureText(edge.label, 10) + 12}" height="18" rx="4" fill="${isDark ? '#1a1f2e' : '#ffffff'}" stroke="${edgeColor}" stroke-width="1" opacity="0.9"/>\n`
      svg += `  <text x="${midPt.x}" y="${midPt.y}" text-anchor="middle" dominant-baseline="central" font-size="10" fill="${theme.edgeLabel}" font-family="Inter, system-ui, -apple-system, sans-serif">${svgEscape(edge.label)}</text>\n`
    }
    svg += `</g>\n`
  }

  // 渲染节点
  for (const node of nodes) {
    const sgIdx = getNodeSubgraphIndex(node.id, data.subgraphs)
    const colors = sgIdx >= 0
      ? nodeColors[sgIdx % nodeColors.length]
      : { fill: theme.nodeFill, stroke: theme.nodeStroke, text: theme.nodeText }

    svg += `<g class="node">\n`
    // 节点阴影
    svg += `  <rect x="${node.x - node.width / 2 + 2}" y="${node.y - node.height / 2 + 2}" width="${node.width}" height="${node.height}" rx="6" ry="6" fill="rgba(0,0,0,0.04)" stroke="none"/>\n`
    // 节点形状
    svg += `  ${renderNodeShape(node, colors.fill, colors.stroke)}\n`
    // 节点文本
    svg += renderMultilineText(node.x, node.y, node.label, 12, colors.text, '500')
    svg += `</g>\n`
  }

  svg += `</svg>`
  return svg
}