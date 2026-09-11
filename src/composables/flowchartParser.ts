/**
 * 轻量级 Mermaid graph 语法解析器
 * 支持: graph TB/LR, subgraph, 节点(方括号/圆括号/花括号/菱形), 边(-->)
 */

export interface FlowNode {
  id: string
  label: string
  shape: 'rect' | 'round' | 'diamond' | 'hexagon' | 'stadium'
}

export interface FlowEdge {
  from: string
  to: string
  label?: string
}

export interface FlowSubgraph {
  id: string
  label: string
  nodeIds: string[]
}

export interface FlowchartData {
  direction: 'TB' | 'LR' | 'BT' | 'RL'
  nodes: FlowNode[]
  edges: FlowEdge[]
  subgraphs: FlowSubgraph[]
}

/**
 * 解析 Mermaid graph 语法
 */
export function parseMermaidGraph(code: string): FlowchartData | null {
  // 预处理：将引号内的换行符替换为 \\n 字面量，避免节点定义被拆分到多行
  // 例如 IP["IndexPage\n@Page(QQSport)"] 中的真实换行符需要合并回一行
  const preprocessed = mergeMultilineQuotes(code)
  const lines = preprocessed.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('%%'))

  if (lines.length === 0) return null

  // 解析方向
  const firstLine = lines[0]
  let direction: FlowchartData['direction'] = 'TB'
  const dirMatch = firstLine.match(/^(?:graph|flowchart)\s+(TB|BT|LR|RL|TD)/i)
  if (!dirMatch) return null
  const dir = dirMatch[1].toUpperCase()
  if (dir === 'TD') direction = 'TB'
  else direction = dir as FlowchartData['direction']

  const nodes = new Map<string, FlowNode>()
  const edges: FlowEdge[] = []
  const subgraphs: FlowSubgraph[] = []

  // 子图栈
  const subgraphStack: FlowSubgraph[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]

    // 跳过 end 关键字
    if (/^end$/i.test(line)) {
      if (subgraphStack.length > 0) {
        const sg = subgraphStack.pop()!
        subgraphs.push(sg)
      }
      continue
    }

    // 跳过 style/classDef/class 行
    if (/^(?:style|classDef|class)\s/i.test(line)) continue

    // 解析 subgraph - 支持多种格式：
    // subgraph ID["label"]
    // subgraph ID["label with spaces"]
    // subgraph ID "label"
    // subgraph ID label
    // subgraph ID
    const sgMatch = line.match(/^subgraph\s+(\w+)(?:\["(.+?)"\])?(?:\s+"(.+?)")?(?:\s+(.+?))?$/i)
    if (sgMatch) {
      const sgId = sgMatch[1]
      const sgLabel = sgMatch[2] || sgMatch[3] || sgMatch[4] || sgId
      subgraphStack.push({ id: sgId, label: sgLabel, nodeIds: [] })
      continue
    }

    // 尝试解析边（包含 --> 的行）
    if (line.includes('-->') || line.includes('==>') || line.includes('-.->')) {
      const edgeParsed = parseEdgeLine(line)
      if (edgeParsed) {
        for (const ep of edgeParsed) {
          ensureNode(nodes, ep.fromNode)
          ensureNode(nodes, ep.toNode)
          edges.push({ from: ep.fromNode.id, to: ep.toNode.id, label: ep.label })

          // 添加到当前子图
          if (subgraphStack.length > 0) {
            const currentSg = subgraphStack[subgraphStack.length - 1]
            if (!currentSg.nodeIds.includes(ep.fromNode.id)) currentSg.nodeIds.push(ep.fromNode.id)
            if (!currentSg.nodeIds.includes(ep.toNode.id)) currentSg.nodeIds.push(ep.toNode.id)
          }
        }
        continue
      }
    }

    // 尝试解析独立节点定义
    const nodeDef = parseNodeDef(line)
    if (nodeDef && nodeDef.id && !['style', 'classDef', 'class', 'end', 'subgraph'].includes(nodeDef.id)) {
      ensureNode(nodes, nodeDef)
      if (subgraphStack.length > 0) {
        const currentSg = subgraphStack[subgraphStack.length - 1]
        if (!currentSg.nodeIds.includes(nodeDef.id)) currentSg.nodeIds.push(nodeDef.id)
      }
    }
  }

  // 后处理：将边中引用的子图 ID 转换为子图中的代表节点
  const subgraphIds = new Set(subgraphs.map(sg => sg.id))
  const resolvedEdges: FlowEdge[] = []
  for (const edge of edges) {
    let fromId = edge.from
    let toId = edge.to

    // 如果 from 是子图 ID，使用子图中最后一个节点作为代表
    if (subgraphIds.has(fromId)) {
      const sg = subgraphs.find(s => s.id === fromId)
      if (sg && sg.nodeIds.length > 0) {
        fromId = sg.nodeIds[sg.nodeIds.length - 1]
        // 移除作为节点创建的子图 ID
        nodes.delete(edge.from)
      }
    }

    // 如果 to 是子图 ID，使用子图中第一个节点作为代表
    if (subgraphIds.has(toId)) {
      const sg = subgraphs.find(s => s.id === toId)
      if (sg && sg.nodeIds.length > 0) {
        toId = sg.nodeIds[0]
        // 移除作为节点创建的子图 ID
        nodes.delete(edge.to)
      }
    }

    resolvedEdges.push({ from: fromId, to: toId, label: edge.label })
  }

  return {
    direction,
    nodes: Array.from(nodes.values()),
    edges: resolvedEdges,
    subgraphs,
  }
}

/**
 * 解析边行 - 支持链式边 A --> B --> C
 * 返回解析出的所有边
 */
interface ParsedEdge {
  fromNode: FlowNode
  toNode: FlowNode
  label?: string
}

function parseEdgeLine(line: string): ParsedEdge[] | null {
  // 先提取所有节点段和边连接符
  // 策略：按照边连接符分割，每段是一个节点定义
  const segments: string[] = []
  const edgeLabels: (string | undefined)[] = []

  // 使用正则分割边连接符，支持 -->, ===>, -.->，以及带标签的 -->|label|, -- label -->
  let remaining = line

  while (remaining.length > 0) {
    // 查找下一个边连接符
    // 支持: -->|label|, -- label -->, -->, ===>, -.->
    const edgePattern = /\s+(?:-->|==>|-\.->)\s*(?:\|([^|]*)\|\s*)?/
    const labeledEdgePattern = /\s+--\s+(.+?)\s+-->\s*/

    const labeledMatch = remaining.match(labeledEdgePattern)
    const normalMatch = remaining.match(edgePattern)

    let matchToUse: RegExpMatchArray | null = null
    let edgeLabel: string | undefined

    // 选择最早出现的匹配
    if (labeledMatch && normalMatch) {
      if ((labeledMatch.index || 0) <= (normalMatch.index || 0)) {
        matchToUse = labeledMatch
        edgeLabel = labeledMatch[1]
      } else {
        matchToUse = normalMatch
        edgeLabel = normalMatch[1]
      }
    } else if (labeledMatch) {
      matchToUse = labeledMatch
      edgeLabel = labeledMatch[1]
    } else if (normalMatch) {
      matchToUse = normalMatch
      edgeLabel = normalMatch[1]
    }

    if (matchToUse && matchToUse.index !== undefined) {
      const before = remaining.substring(0, matchToUse.index).trim()
      if (before) segments.push(before)
      edgeLabels.push(edgeLabel)
      remaining = remaining.substring(matchToUse.index + matchToUse[0].length)
    } else {
      // 没有更多边连接符
      const trimmed = remaining.trim()
      if (trimmed) segments.push(trimmed)
      break
    }
  }

  if (segments.length < 2) return null

  const result: ParsedEdge[] = []
  for (let i = 0; i < segments.length - 1; i++) {
    const fromNode = parseNodeDef(segments[i])
    const toNode = parseNodeDef(segments[i + 1])
    result.push({ fromNode, toNode, label: edgeLabels[i] })
  }

  return result.length > 0 ? result : null
}

/**
 * 解析节点定义字符串
 * 支持格式：
 *   ID["label with spaces and \n"]
 *   ID[label]
 *   ID(label)
 *   ID((label))
 *   ID{label}
 *   ID>label]
 *   ID
 */
function parseNodeDef(str: string): FlowNode {
  str = str.trim()

  // 移除尾部的分号
  str = str.replace(/;$/, '').trim()

  // ID["label"] 带引号的方括号 - 使用贪婪匹配引号内内容
  let match = str.match(/^([A-Za-z_]\w*)\["((?:[^"\\]|\\.)*)"\]$/)
  if (match) return { id: match[1], label: match[2].replace(/\\n/g, '\n').replace(/\\"/g, '"'), shape: 'rect' }

  // ID("label") 带引号的圆括号
  match = str.match(/^([A-Za-z_]\w*)\("((?:[^"\\]|\\.)*)"\)$/)
  if (match) return { id: match[1], label: match[2].replace(/\\n/g, '\n').replace(/\\"/g, '"'), shape: 'round' }

  // ID{"label"} 带引号的花括号（菱形）
  match = str.match(/^([A-Za-z_]\w*)\{"((?:[^"\\]|\\.)*)"\}$/)
  if (match) return { id: match[1], label: match[2].replace(/\\n/g, '\n').replace(/\\"/g, '"'), shape: 'diamond' }

  // ID((label)) 双圆括号 -> stadium
  match = str.match(/^([A-Za-z_]\w*)\(\((.+?)\)\)$/)
  if (match) return { id: match[1], label: match[2].replace(/\\n/g, '\n'), shape: 'stadium' }

  // ID[label] 方括号 -> rect（不带引号，不含 ] 字符）
  match = str.match(/^([A-Za-z_]\w*)\[([^\]]+)\]$/)
  if (match) return { id: match[1], label: match[2].replace(/\\n/g, '\n'), shape: 'rect' }

  // ID(label) 圆括号 -> round（不含 ) 字符）
  match = str.match(/^([A-Za-z_]\w*)\(([^)]+)\)$/)
  if (match) return { id: match[1], label: match[2].replace(/\\n/g, '\n'), shape: 'round' }

  // ID{label} 花括号 -> diamond
  match = str.match(/^([A-Za-z_]\w*)\{([^}]+)\}$/)
  if (match) return { id: match[1], label: match[2].replace(/\\n/g, '\n'), shape: 'diamond' }

  // ID>label] 旗帜形
  match = str.match(/^([A-Za-z_]\w*)>([^\]]+)\]$/)
  if (match) return { id: match[1], label: match[2].replace(/\\n/g, '\n'), shape: 'hexagon' }

  // 纯 ID（只允许合法标识符字符）
  match = str.match(/^([A-Za-z_]\w*)$/)
  if (match) return { id: match[1], label: match[1], shape: 'rect' }

  // 如果以上都不匹配，尝试提取 ID 部分
  match = str.match(/^([A-Za-z_]\w*)/)
  if (match) return { id: match[1], label: match[1], shape: 'rect' }

  return { id: str, label: str, shape: 'rect' }
}

function ensureNode(nodes: Map<string, FlowNode>, node: FlowNode) {
  if (!nodes.has(node.id)) {
    nodes.set(node.id, node)
  } else {
    // 如果已存在但新的有更好的 label，更新
    const existing = nodes.get(node.id)!
    if (existing.label === existing.id && node.label !== node.id) {
      existing.label = node.label
      existing.shape = node.shape
    }
  }
}

/**
 * 预处理：合并引号内的多行内容
 * 当节点标签中包含真实换行符时（如模板字符串中的 \n），
 * 将其替换为 \\n 字面量，确保每个节点定义在一行内
 */
function mergeMultilineQuotes(code: string): string {
  const result: string[] = []
  let buffer = ''
  let inQuote = false
  let bracketDepth = 0

  for (const ch of code) {
    if (ch === '"' && !inQuote) {
      inQuote = true
      buffer += ch
    } else if (ch === '"' && inQuote) {
      inQuote = false
      buffer += ch
    } else if (inQuote && ch === '\n') {
      // 引号内的换行替换为 \\n 字面量
      buffer += '\\n'
    } else if (ch === '\n' && !inQuote) {
      result.push(buffer)
      buffer = ''
    } else {
      buffer += ch
    }
  }
  if (buffer) result.push(buffer)

  return result.join('\n')
}
