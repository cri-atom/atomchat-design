import { dia } from '@joint/plus';
import {
  BODY_BG,
  BODY_BORDER,
  ERROR_COLOR,
  FONT_FAMILY,
  ICONS,
  PORT_COLOR,
  PORT_STROKE,
  TEXT_LIGHT,
  TEXT_MUTED,
  TEXT_PRIMARY,
} from '../theme';

export const ToolNodeShape = dia.Element.define('agentApp.ToolNode', {
  size: { width: 200, height: 72 },
  ports: {
    groups: {
      in: { position: { name: 'top' }, attrs: { portBody: { fill: PORT_COLOR, stroke: PORT_STROKE, strokeWidth: 4, opacity: 0, magnet: 'passive', r: 5 } }, size: { width: 10, height: 10 }, markup: [{ tagName: 'circle', selector: 'portBody' }] },
      out: { position: { name: 'bottom' }, attrs: { portBody: { fill: PORT_COLOR, stroke: PORT_STROKE, strokeWidth: 4, opacity: 0, magnet: false, r: 5 } }, size: { width: 10, height: 10 }, markup: [{ tagName: 'circle', selector: 'portBody' }] },
    },
    items: [{ id: 'in-port', group: 'in' }, { id: 'out-port', group: 'out' }],
  },
  attrs: {
    body: { fill: BODY_BG, stroke: BODY_BORDER, strokeWidth: 1, rx: 12, ry: 12, refWidth: '100%', refHeight: '100%' },
    icon: { d: ICONS.wrench, stroke: 'none', fill: TEXT_MUTED, refX: 14, refY: 16, transform: 'scale(0.023)' },
    label: { text: 'Tool dispatch', refX: 40, refY: 20, textAnchor: 'start', fill: TEXT_PRIMARY, fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: '600' },
    toolsList: { text: '', refX: 14, refY: 48, textAnchor: 'start', fill: TEXT_LIGHT, fontFamily: FONT_FAMILY, fontSize: 9 },
    addButtonBg: { width: 24, height: 24, rx: 12, ry: 12, fill: BODY_BG, stroke: BODY_BORDER, refX: '50%', refDy: 8, x: -12, cursor: 'pointer', event: 'cell:addChild', magnet: true },
    addButtonIcon: { d: ICONS.plus, stroke: 'none', fill: TEXT_LIGHT, refX: '50%', refDy: 12, transform: 'translate(-5, 6) scale(0.018)', pointerEvents: 'none' },
    errorCircle: { r: 10, cx: 182, cy: 14, fill: ERROR_COLOR, visibility: 'hidden' },
    errorBang: { text: '!', x: 182, y: 19, textAnchor: 'middle', fill: BODY_BG, fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: '700', visibility: 'hidden' },
    data: { tools: [] },
  },
  markup: [
    { tagName: 'rect', selector: 'body' },
    { tagName: 'path', selector: 'icon' },
    { tagName: 'text', selector: 'label' },
    { tagName: 'text', selector: 'toolsList' },
    { tagName: 'rect', selector: 'addButtonBg' },
    { tagName: 'path', selector: 'addButtonIcon' },
    { tagName: 'circle', selector: 'errorCircle' },
    { tagName: 'text', selector: 'errorBang' },
  ],
});
