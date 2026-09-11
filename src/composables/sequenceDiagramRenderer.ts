/**
 * 时序图（Sequence Diagram）解析器 + SVG 渲染器
 * 支持 Mermaid sequenceDiagram 语法的子集：
 *   participant / actor 声明
 *   消息箭头: ->>, -->>，->>，-->>，->, -->
 *   Note over / Note left of / Note right of
 *   activate / deactivate
 *   loop / alt / opt / par / rect / break / critical 块
 */

// ============ 类型定义 ============

interface Participant {
  id: string
  alias: string
}

type ArrowStyle = 'solid' | 'dashed'
type ArrowHead = 'filled' | 'open'

interface Message {
  type: 'message'
  from: string
  to: string
  text: string
  arrowStyle: ArrowStyle
  arrowHead: ArrowHead
  activate?: boolean
  deactivate?: boolean
}

interface NoteItem {
  type: 'note'
  position: 'over' | 'left' | 'right'
  participants: string[]
  text: string
}

interface BlockStart {
  type: 'blockStart'
  kind: string // loop, alt, opt, par, rect, break, critical
  label: string
}

interface BlockElse {
  type: 'blockElse'
  label: string
}

interface BlockEnd {
  type: 'blockEnd'
}

interface ActivateItem {
  type: 'activate' | 'deactivate'
  participant: string
}

type SeqItem = Message | NoteItem | BlockStart | BlockElse | BlockEnd | ActivateItem

interface SequenceDiagramData {
  participants: Participant[]
  items: SeqItem[]
}

// ============ 颜色主题 ============

const LIGHT = {
  bg: '#ffffff',
  participantFill: '#f0fdf4',
  participantStroke: '#22c55e',
  participantText: '#15803d',
  lifeline: '#d1d5db',
  activationFill: '#dcfce7',
  activationStroke: '#22c55e',
  arrowSolid: '#475569',
  arrowDashed: '#94a3b8',
  messageText: '#334155',
  noteFill: '#fefce8',
  noteStroke: '#facc15',
  noteText: '#713f12',
  blockFill: 'rgba(59, 130, 246, 0.03)',
  blockStroke: 'rgba(59, 130, 246, 0.25)',
  blockLabel: '#3b82f6',
  blockLabelBg: '#eff6ff',
}

const DARK = {
  bg: '#0B0F19',
  participantFill: 'rgba(0, 220, 130, 0.08)',
  participantStroke: '#00DC82',
  participantText: '#a7f3d0',
  lifeline: '#334155',
  activationFill: 'rgba(0, 220, 130, 0.12)',
  activationStroke: '#00DC82',
  arrowSolid: '#94a3b8',
  arrowDashed: '#64748b',
  messageText: '#cbd5e1',
  noteFill: 'rgba(250, 204, 21, 0.08)',
  noteStroke: 'rgba(250, 204, 21, 0.4)',
  noteText: '#fde68a',
  blockFill: 'rgba(59, 130, 246, 0.05)',
  blockStroke: 'rgba(59, 130, 246, 0.3)',
  blockLabel: '#60a5fa',
  blockLabelBg: 'rgba(59, 130, 246, 0.15)',
}

// ============ 解析器 ============

/**
 * 判断是否为时序图代码
 */
export function isSequenceDiagram(code: string): boolean {
  return /^\s*sequenceDiagram/i.test(code.trim())
}

/**
 * 解析 Mermaid sequenceDiagram 语法
 */
function parseSequenceDiagram(code: string): SequenceDiagramData | null {
  const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('%%'))

  if (lines.length === 0) return null
  if (!/^sequenceDiagram$/i.test(lines[0])) return null

  const participants: Participant[] = []
  const participantIds = new Set<string>()
  const items: SeqItem[] = []

  const ensureParticipant = (id: string) => {
    if (!participantIds.has(id)) {
      participantIds.add(id)
      participants.push({ id, alias: id })
    }
  }

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]

    // participant / actor 声明
    const partMatch = line.match(/^(?:participant|actor)\s+(\S+?)(?:\s+as\s+(.+))?$/i)
    if (partMatch) {
      const id = partMatch[1]
      const alias = partMatch[2] || id
      if (!participantIds.has(id)) {
        participantIds.add(id)
        participants.push({ id, alias })
      } else {
        // 更新别名
        const p = participants.find(p => p.id === id)
        if (p && partMatch[2]) p.alias = alias
      }
      continue
    }

    // Note
    const noteMatch = line.match(/^Note\s+(over|left of|right of)\s+(.+?):\s*(.+)$/i)
    if (noteMatch) {
      const position = noteMatch[1].toLowerCase().startsWith('over') ? 'over'
        : noteMatch[1].toLowerCase().startsWith('left') ? 'left' : 'right'
      const partNames = noteMatch[2].split(',').map(s => s.trim())
      partNames.forEach(ensureParticipant)
      items.push({ type: 'note', position, participants: partNames, text: noteMatch[3] })
      continue
    }

    // activate / deactivate
    const actMatch = line.match(/^(activate|deactivate)\s+(\S+)$/i)
    if (actMatch) {
      const actType = actMatch[1].toLowerCase() as 'activate' | 'deactivate'
      ensureParticipant(actMatch[2])
      items.push({ type: actType, participant: actMatch[2] })
      continue
    }

    // Block start: loop, alt, opt, par, rect, break, critical
    const blockMatch = line.match(/^(loop|alt|opt|par|rect|break|critical)\s*(.*)$/i)
    if (blockMatch) {
      items.push({ type: 'blockStart', kind: blockMatch[1].toLowerCase(), label: blockMatch[2] || '' })
      continue
    }

    // Block else
    const elseMatch = line.match(/^else\s*(.*)$/i)
    if (elseMatch) {
      items.push({ type: 'blockElse', label: elseMatch[1] || '' })
      continue
    }

    // Block end
    if (/^end$/i.test(line)) {
      items.push({ type: 'blockEnd' })
      continue
    }

    // 消息箭头: A->>B: text, A-->>B: text, A->>+B: text, A-->>-B: text, A->B: text, A-->B: text
    const msgMatch = line.match(/^(.+?)\s*(--?>>?[+-]?|--?>?[+-]?|\.\.?>?[+-]?)\s*([+-]?)(\S+?)\s*:\s*(.+)$/)
    if (msgMatch) {
      const from = msgMatch[1].trim()
      const arrow = msgMatch[2]
      const modAfter = msgMatch[3]
      const to = msgMatch[4].trim()
      const text = msgMatch[5].trim()

      ensureParticipant(from)
      ensureParticipant(to)

      const arrowStyle: ArrowStyle = arrow.startsWith('--') ? 'dashed' : 'solid'
      const arrowHead: ArrowHead = arrow.includes('>>') ? 'filled' : 'open'

      const msg: Message = { type: 'message', from, to, text, arrowStyle, arrowHead }

      // +/- 修饰符表示 activate/deactivate
      if (arrow.includes('+') || modAfter === '+') {
        msg.activate = true
      }
      if (arrow.includes('-') || modAfter === '-') {
        msg.deactivate = true
      }

      items.push(msg)
      continue
    }
  }

  return { participants, items }
}

// ============ SVG 渲染器 ============

function svgEscape(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * 测量文本宽度（近似）
 */
function measureText(text: string, fontSize: number = 12): number {
  let width = 0
  for (const char of text) {
    if (/[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/.test(char)) {
      width += fontSize * 0.95
    } else {
      width += fontSize * 0.6
    }
  }
  return width
}

/**
 * 主渲染函数：将 sequenceDiagram 代码渲染为 SVG 字符串
 */
export function renderSequenceDiagramSVG(code: string, isDark: boolean = false): string | null {
  const data = parseSequenceDiagram(code)
  if (!data || data.participants.length === 0) return null

  const theme = isDark ? DARK : LIGHT

  // ---- 布局参数 ----
  const PARTICIPANT_PAD_X = 16
  const PARTICIPANT_PAD_Y = 10
  const PARTICIPANT_FONT = 13
  const PARTICIPANT_HEIGHT = PARTICIPANT_FONT + PARTICIPANT_PAD_Y * 2
  const MIN_COL_WIDTH = 160
  const ROW_HEIGHT = 42
  const MSG_FONT = 11.5
  const NOTE_FONT = 11
  const NOTE_PAD_X = 10
  const NOTE_PAD_Y = 6
  const NOTE_MAX_WIDTH = 180
  const BLOCK_PAD = 8
  const TOP_MARGIN = 20
  const BOTTOM_MARGIN = 40
  const SIDE_MARGIN = 30
  const ACTIVATION_WIDTH = 10

  // ---- 计算参与者列宽 ----
  const partCount = data.participants.length
  const partWidths = data.participants.map(p => {
    const tw = measureText(p.alias, PARTICIPANT_FONT) + PARTICIPANT_PAD_X * 2
    return Math.max(tw, 60)
  })

  // 计算每列宽度（取相邻参与者之间的最大需求）
  const colWidths: number[] = []
  for (let i = 0; i < partCount; i++) {
    colWidths.push(Math.max(MIN_COL_WIDTH, partWidths[i] + 20))
  }

  // 参与者 X 坐标（中心点）
  const partX: number[] = []
  let cx = SIDE_MARGIN + colWidths[0] / 2
  for (let i = 0; i < partCount; i++) {
    partX.push(cx)
    if (i < partCount - 1) {
      cx += colWidths[i] / 2 + colWidths[i + 1] / 2
    }
  }

  const totalWidth = cx + colWidths[partCount - 1] / 2 + SIDE_MARGIN

  // ---- 计算行 Y 坐标 ----
  const participantTopY = TOP_MARGIN
  const firstRowY = participantTopY + PARTICIPANT_HEIGHT + 30

  // 预计算每个 item 的 Y 坐标
  let currentY = firstRowY
  const itemYs: number[] = []
  const blockStack: { startIdx: number; y: number }[] = []

  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i]
    if (item.type === 'blockStart') {
      blockStack.push({ startIdx: i, y: currentY })
      itemYs.push(currentY)
      currentY += ROW_HEIGHT * 0.6
    } else if (item.type === 'blockElse') {
      itemYs.push(currentY)
      currentY += ROW_HEIGHT * 0.4
    } else if (item.type === 'blockEnd') {
      itemYs.push(currentY)
      blockStack.pop()
      currentY += ROW_HEIGHT * 0.4
    } else if (item.type === 'note') {
      itemYs.push(currentY)
      const lines = item.text.split('<br/>').length
      currentY += Math.max(ROW_HEIGHT, lines * 18 + NOTE_PAD_Y * 2 + 8)
    } else if (item.type === 'activate' || item.type === 'deactivate') {
      itemYs.push(currentY)
      // 不占额外行高
    } else {
      // message
      itemYs.push(currentY)
      currentY += ROW_HEIGHT
    }
  }

  const participantBottomY = currentY + 20
  const totalHeight = participantBottomY + PARTICIPANT_HEIGHT + BOTTOM_MARGIN

  // ---- 辅助函数 ----
  const getPartIdx = (id: string) => data.participants.findIndex(p => p.id === id)
  const getPartX = (id: string) => {
    const idx = getPartIdx(id)
    return idx >= 0 ? partX[idx] : 0
  }

  // ---- 生成 SVG ----
  const uid = `seq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" width="${totalWidth}" height="${totalHeight}" style="font-family: Inter, system-ui, -apple-system, sans-serif;">\n`

  // Defs
  svg += `<defs>\n`
  // 实心箭头
  svg += `  <marker id="${uid}-arrow-filled" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">\n`
  svg += `    <path d="M 0 0 L 10 5 L 0 10 z" fill="${theme.arrowSolid}"/>\n`
  svg += `  </marker>\n`
  // 空心箭头
  svg += `  <marker id="${uid}-arrow-open" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">\n`
  svg += `    <path d="M 0 0 L 10 5 L 0 10" fill="none" stroke="${theme.arrowSolid}" stroke-width="1.5"/>\n`
  svg += `  </marker>\n`
  // 虚线箭头
  svg += `  <marker id="${uid}-arrow-dashed" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">\n`
  svg += `    <path d="M 0 0 L 10 5 L 0 10 z" fill="${theme.arrowDashed}"/>\n`
  svg += `  </marker>\n`
  svg += `</defs>\n`

  // ---- 生命线 ----
  for (let i = 0; i < partCount; i++) {
    const x = partX[i]
    const y1 = participantTopY + PARTICIPANT_HEIGHT
    const y2 = participantBottomY
    svg += `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${theme.lifeline}" stroke-width="1" stroke-dasharray="6 4"/>\n`
  }

  // ---- 渲染参与者（顶部 + 底部） ----
  const renderParticipant = (p: Participant, y: number) => {
    const x = getPartX(p.id)
    const w = measureText(p.alias, PARTICIPANT_FONT) + PARTICIPANT_PAD_X * 2
    const h = PARTICIPANT_HEIGHT
    let s = ''
    // 阴影
    s += `<rect x="${x - w / 2 + 1.5}" y="${y + 1.5}" width="${w}" height="${h}" rx="8" ry="8" fill="rgba(0,0,0,0.04)" stroke="none"/>\n`
    // 背景
    s += `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${h}" rx="8" ry="8" fill="${theme.participantFill}" stroke="${theme.participantStroke}" stroke-width="1.5"/>\n`
    // 文字
    s += `<text x="${x}" y="${y + h / 2}" text-anchor="middle" dominant-baseline="central" font-size="${PARTICIPANT_FONT}" font-weight="600" fill="${theme.participantText}">${svgEscape(p.alias)}</text>\n`
    return s
  }

  for (const p of data.participants) {
    svg += renderParticipant(p, participantTopY)
    svg += renderParticipant(p, participantBottomY)
  }

  // ---- 追踪激活状态 ----
  const activations: Map<string, { startY: number }[]> = new Map()

  const pushActivation = (partId: string, y: number) => {
    if (!activations.has(partId)) activations.set(partId, [])
    activations.get(partId)!.push({ startY: y })
  }

  const popActivation = (partId: string, endY: number): string => {
    const stack = activations.get(partId)
    if (!stack || stack.length === 0) return ''
    const act = stack.pop()!
    const x = getPartX(partId)
    const hw = ACTIVATION_WIDTH / 2
    return `<rect x="${x - hw}" y="${act.startY}" width="${ACTIVATION_WIDTH}" height="${endY - act.startY}" rx="3" ry="3" fill="${theme.activationFill}" stroke="${theme.activationStroke}" stroke-width="1"/>\n`
  }

  // ---- 渲染 items ----
  // 先收集 block 区域
  interface BlockRegion {
    kind: string
    label: string
    startY: number
    endY: number
    sections: { label: string; y: number }[]
  }
  const blockRegions: BlockRegion[] = []
  const blockBuildStack: BlockRegion[] = []

  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i]
    const y = itemYs[i]

    if (item.type === 'blockStart') {
      blockBuildStack.push({ kind: item.kind, label: item.label, startY: y, endY: y, sections: [] })
    } else if (item.type === 'blockElse') {
      if (blockBuildStack.length > 0) {
        blockBuildStack[blockBuildStack.length - 1].sections.push({ label: item.label, y })
      }
    } else if (item.type === 'blockEnd') {
      if (blockBuildStack.length > 0) {
        const block = blockBuildStack.pop()!
        block.endY = y
        blockRegions.push(block)
      }
    }
  }

  // 渲染 block 背景
  for (const block of blockRegions) {
    const bx = SIDE_MARGIN - BLOCK_PAD
    const bw = totalWidth - 2 * SIDE_MARGIN + 2 * BLOCK_PAD
    const by = block.startY - 12
    const bh = block.endY - block.startY + 20

    svg += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="8" ry="8" fill="${theme.blockFill}" stroke="${theme.blockStroke}" stroke-width="1.5" stroke-dasharray="4 3"/>\n`

    // 标签
    const labelText = `${block.kind}${block.label ? ' [' + block.label + ']' : ''}`
    const labelW = measureText(labelText, 10) + 16
    svg += `<rect x="${bx}" y="${by}" width="${labelW}" height="20" rx="8" ry="0" fill="${theme.blockLabelBg}" stroke="${theme.blockStroke}" stroke-width="1"/>\n`
    // 修正圆角：左上和右下
    svg += `<path d="M${bx} ${by + 8} Q${bx} ${by} ${bx + 8} ${by} L${bx + labelW - 6} ${by} Q${bx + labelW} ${by} ${bx + labelW} ${by + 6} L${bx + labelW} ${by + 14} Q${bx + labelW} ${by + 20} ${bx + labelW - 6} ${by + 20} L${bx} ${by + 20} Z" fill="${theme.blockLabelBg}" stroke="none"/>\n`
    svg += `<text x="${bx + 8}" y="${by + 13}" font-size="10" font-weight="700" fill="${theme.blockLabel}">${svgEscape(labelText)}</text>\n`

    // else 分隔线
    for (const section of block.sections) {
      const sy = section.y - 6
      svg += `<line x1="${bx}" y1="${sy}" x2="${bx + bw}" y2="${sy}" stroke="${theme.blockStroke}" stroke-width="1" stroke-dasharray="6 3"/>\n`
      if (section.label) {
        svg += `<text x="${bx + 12}" y="${sy + 14}" font-size="10" font-weight="600" fill="${theme.blockLabel}">[${svgEscape(section.label)}]</text>\n`
      }
    }
  }

  // 渲染消息和注释
  let activationSvg = ''

  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i]
    const y = itemYs[i]

    if (item.type === 'message') {
      const fromX = getPartX(item.from)
      const toX = getPartX(item.to)
      const isSelf = item.from === item.to

      if (isSelf) {
        // 自调用消息
        const loopW = 40
        const loopH = 25
        const color = item.arrowStyle === 'dashed' ? theme.arrowDashed : theme.arrowSolid
        const dashAttr = item.arrowStyle === 'dashed' ? ' stroke-dasharray="6 3"' : ''
        const markerId = item.arrowStyle === 'dashed' ? `${uid}-arrow-dashed` : (item.arrowHead === 'filled' ? `${uid}-arrow-filled` : `${uid}-arrow-open`)

        svg += `<path d="M${fromX} ${y} L${fromX + loopW} ${y} L${fromX + loopW} ${y + loopH} L${fromX + 4} ${y + loopH}" fill="none" stroke="${color}" stroke-width="1.5"${dashAttr} marker-end="url(#${markerId})"/>\n`
        svg += `<text x="${fromX + loopW + 6}" y="${y + loopH / 2}" font-size="${MSG_FONT}" fill="${theme.messageText}" dominant-baseline="central">${svgEscape(item.text)}</text>\n`
      } else {
        const isLeftToRight = fromX < toX
        const x1 = fromX + (isLeftToRight ? 4 : -4)
        const x2 = toX + (isLeftToRight ? -4 : 4)
        const color = item.arrowStyle === 'dashed' ? theme.arrowDashed : theme.arrowSolid
        const dashAttr = item.arrowStyle === 'dashed' ? ' stroke-dasharray="6 3"' : ''
        const markerId = item.arrowStyle === 'dashed' ? `${uid}-arrow-dashed` : (item.arrowHead === 'filled' ? `${uid}-arrow-filled` : `${uid}-arrow-open`)

        svg += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}" stroke-width="1.5"${dashAttr} marker-end="url(#${markerId})"/>\n`

        // 消息文本（居中在箭头上方）
        const midX = (x1 + x2) / 2
        const textW = measureText(item.text, MSG_FONT)
        // 文本背景（半透明遮挡生命线）
        svg += `<rect x="${midX - textW / 2 - 4}" y="${y - 17}" width="${textW + 8}" height="14" rx="3" fill="${isDark ? 'rgba(11,15,25,0.85)' : 'rgba(255,255,255,0.9)'}" stroke="none"/>\n`
        svg += `<text x="${midX}" y="${y - 8}" text-anchor="middle" font-size="${MSG_FONT}" fill="${theme.messageText}" font-weight="500">${svgEscape(item.text)}</text>\n`
      }

      // 处理 activate/deactivate
      if (item.activate) {
        pushActivation(item.to, y)
      }
      if (item.deactivate) {
        activationSvg += popActivation(item.from, y)
      }
    } else if (item.type === 'note') {
      const partXs = item.participants.map(p => getPartX(p))
      const minPX = Math.min(...partXs)
      const maxPX = Math.max(...partXs)
      const centerX = (minPX + maxPX) / 2

      const noteLines = item.text.split('<br/>')
      const noteW = Math.min(NOTE_MAX_WIDTH, Math.max(...noteLines.map(l => measureText(l, NOTE_FONT))) + NOTE_PAD_X * 2)
      const noteH = noteLines.length * 16 + NOTE_PAD_Y * 2

      let noteX: number
      if (item.position === 'over') {
        noteX = centerX - noteW / 2
      } else if (item.position === 'right') {
        noteX = maxPX + 15
      } else {
        noteX = minPX - noteW - 15
      }

      const noteY = y - noteH / 2

      // 折角效果
      const foldSize = 8
      svg += `<path d="M${noteX} ${noteY} L${noteX + noteW - foldSize} ${noteY} L${noteX + noteW} ${noteY + foldSize} L${noteX + noteW} ${noteY + noteH} L${noteX} ${noteY + noteH} Z" fill="${theme.noteFill}" stroke="${theme.noteStroke}" stroke-width="1"/>\n`
      svg += `<path d="M${noteX + noteW - foldSize} ${noteY} L${noteX + noteW - foldSize} ${noteY + foldSize} L${noteX + noteW} ${noteY + foldSize}" fill="none" stroke="${theme.noteStroke}" stroke-width="0.8"/>\n`

      // 注释文本
      noteLines.forEach((line, li) => {
        svg += `<text x="${noteX + NOTE_PAD_X}" y="${noteY + NOTE_PAD_Y + 12 + li * 16}" font-size="${NOTE_FONT}" fill="${theme.noteText}">${svgEscape(line)}</text>\n`
      })
    } else if (item.type === 'activate') {
      pushActivation(item.participant, y)
    } else if (item.type === 'deactivate') {
      activationSvg += popActivation(item.participant, y)
    }
  }

  // 关闭所有未关闭的激活
  for (const [partId, stack] of activations) {
    while (stack.length > 0) {
      activationSvg += popActivation(partId, participantBottomY)
    }
  }

  // 将激活矩形插入（在生命线之后、消息之前渲染效果最好，但这里追加也可以）
  svg += activationSvg

  svg += `</svg>`
  return svg
}
