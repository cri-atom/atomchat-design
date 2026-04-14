import { dia } from '@joint/plus';
import { BODY_BG, BODY_BORDER, ERROR_COLOR, FONT_FAMILY, PORT_COLOR, ICONS } from '../theme';

export const AgentNodeShape = dia.Element.define('agentApp.AgentNode', {
  size: { width: 268, height: 116 },
  ports: {
    groups: {
      in: {
        position: { name: 'top' },
        attrs: { portBody: { fill: PORT_COLOR, stroke: '#F5F5F5', strokeWidth: 4, magnet: 'passive', r: 5, opacity: 0 } },
        size: { width: 10, height: 10 },
        markup: [{ tagName: 'circle', selector: 'portBody' }],
      },
      out: {
        position: { name: 'bottom' },
        attrs: { portBody: { fill: PORT_COLOR, stroke: '#F5F5F5', strokeWidth: 4, magnet: false, r: 5, opacity: 0 } },
        size: { width: 10, height: 10 },
        markup: [{ tagName: 'circle', selector: 'portBody' }],
      },
    },
    items: [{ id: 'in-port', group: 'in' }, { id: 'out-port', group: 'out' }],
  },
  attrs: {
    body: {
      fill: BODY_BG, stroke: BODY_BORDER, strokeWidth: 1, rx: 16, ry: 16, refWidth: '100%', refHeight: '100%',
      filter: { name: 'dropShadow', args: { dx: 0, dy: 2, blur: 4, color: '#09090B', opacity: 0.08 } },
    },
    iconBg: { x: 12, y: 16, width: 40, height: 40, rx: 12, ry: 12, fill: '#F4F4F5', stroke: '#E4E4E7', strokeWidth: 1 },
    icon: { d: ICONS.bot, stroke: '#52525C', strokeWidth: 1.5, fill: 'none', refX: 23, refY: 27, transform: 'scale(0.75)' },
    label: { text: 'Nuevo Agente', refX: 62, refY: 31, textAnchor: 'start', textVerticalAnchor: 'middle', fill: '#18181B', fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: '700' },
    subtitle: { text: '', refX: 62, refY: 45, textAnchor: 'start', textVerticalAnchor: 'top', fill: '#71717B', fontFamily: FONT_FAMILY, fontSize: 9, textWrap: { width: 150, maxLineCount: 1, ellipsis: true } },
    separator: { refX: 16, refY: 66, refWidth: -32, d: 'M 0 0 L 236 0', stroke: '#E4E4E7', strokeWidth: 0.5 },
    // Badge: Tools
    badgeToolsBg: { x: 10, y: 70, width: 48, height: 22, rx: 11, ry: 11, fill: '#F4F4F5', stroke: '#E4E4E7', strokeWidth: 1 },
    badgeToolsIcon: { d: ICONS.wrench, stroke: '#71717B', strokeWidth: 1.5, fill: 'none', refX: 16, refY: 74, transform: 'scale(0.55)' },
    badgeToolsText: { text: '+0', refX: 33, refY: 81, textAnchor: 'start', textVerticalAnchor: 'middle', fill: '#71717B', fontFamily: FONT_FAMILY, fontSize: 9 },
    // Badge: Knowledge Base
    badgeKbBg: { x: 64, y: 70, width: 48, height: 22, rx: 11, ry: 11, fill: '#F4F4F5', stroke: '#E4E4E7', strokeWidth: 1 },
    badgeKbIcon: { d: ICONS.database, stroke: '#71717B', strokeWidth: 1.5, fill: 'none', refX: 70, refY: 74, transform: 'scale(0.55)' },
    badgeKbText: { text: '+0', refX: 87, refY: 81, textAnchor: 'start', textVerticalAnchor: 'middle', fill: '#71717B', fontFamily: FONT_FAMILY, fontSize: 9 },
    // Badge: Info Collection
    badgeInfoBg: { x: 118, y: 70, width: 48, height: 22, rx: 11, ry: 11, fill: '#F4F4F5', stroke: '#E4E4E7', strokeWidth: 1 },
    badgeInfoIcon: { d: ICONS.bookmark, stroke: '#71717B', strokeWidth: 1.5, fill: 'none', refX: 124, refY: 74, transform: 'scale(0.55)' },
    badgeInfoText: { text: '+0', refX: 141, refY: 81, textAnchor: 'start', textVerticalAnchor: 'middle', fill: '#71717B', fontFamily: FONT_FAMILY, fontSize: 9 },
    // Add child button
    addButtonBg: { width: 28, height: 28, rx: 14, ry: 14, fill: '#FFFFFF', stroke: '#E4E4E7', strokeWidth: 1.5, refX: '50%', refDy: 10, x: -14, cursor: 'pointer', event: 'cell:addChild', magnet: true },
    addButtonIcon: { d: ICONS.plus, stroke: '#71717B', strokeWidth: 2, fill: 'none', refX: '50%', refDy: 10, transform: 'translate(-6, 8) scale(0.5)', pointerEvents: 'none' },
    // Error indicator (shown when conversationGoal is empty)
    errorCircle: { r: 10, cx: 246, cy: 26, fill: ERROR_COLOR, visibility: 'hidden' },
    errorBang: { text: '!', x: 246, y: 31, textAnchor: 'middle', fill: '#FFFFFF', fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: '700', visibility: 'hidden' },
  },
  markup: [
    { tagName: 'rect', selector: 'body' },
    { tagName: 'rect', selector: 'iconBg' },
    { tagName: 'path', selector: 'icon' },
    { tagName: 'text', selector: 'label' },
    { tagName: 'text', selector: 'subtitle' },
    { tagName: 'path', selector: 'separator' },
    { tagName: 'rect', selector: 'badgeToolsBg' },
    { tagName: 'path', selector: 'badgeToolsIcon' },
    { tagName: 'text', selector: 'badgeToolsText' },
    { tagName: 'rect', selector: 'badgeKbBg' },
    { tagName: 'path', selector: 'badgeKbIcon' },
    { tagName: 'text', selector: 'badgeKbText' },
    { tagName: 'rect', selector: 'badgeInfoBg' },
    { tagName: 'path', selector: 'badgeInfoIcon' },
    { tagName: 'text', selector: 'badgeInfoText' },
    { tagName: 'rect', selector: 'addButtonBg' },
    { tagName: 'path', selector: 'addButtonIcon' },
    { tagName: 'circle', selector: 'errorCircle' },
    { tagName: 'text', selector: 'errorBang' },
  ],
});
