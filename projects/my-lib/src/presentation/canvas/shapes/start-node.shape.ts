import { dia } from '@joint/plus';
import {
  BODY_BG,
  BODY_BORDER,
  FONT_FAMILY,
  ICONS,
  PORT_COLOR,
  PORT_STROKE,
  TEXT_MUTED,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from '../theme';

export const StartNodeShape = dia.Element.define('agentApp.StartNode', {
  size: { width: 100, height: 40 },
  ports: {
    groups: {
      out: {
        position: { name: 'bottom' },
        attrs: { portBody: { fill: PORT_COLOR, stroke: PORT_STROKE, strokeWidth: 4, magnet: true, r: 5, opacity: 0 } },
        size: { width: 10, height: 10 },
        markup: [{ tagName: 'circle', selector: 'portBody' }],
      },
    },
    items: [{ id: 'out-port', group: 'out' }],
  },
  attrs: {
    body: { fill: BODY_BG, stroke: BODY_BORDER, strokeWidth: 1, rx: 8, ry: 8, refWidth: '100%', refHeight: '100%' },
    icon: { d: ICONS.fin, stroke: 'none', fill: TEXT_MUTED, refX: 20, refY: 13, transform: 'scale(1)' },
    label: { text: 'INICIO', refX: '58%', refY: '50%', textAnchor: 'middle', textVerticalAnchor: 'middle', fill: TEXT_PRIMARY, fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: '600' },
    addButtonBg: { width: 24, height: 24, rx: 4, ry: 4, fill: BODY_BG, stroke: BODY_BORDER, refX: '50%', refDy: 8, x: -12, cursor: 'pointer', event: 'cell:addChild' },
    addButtonIcon: { d: ICONS.plus, stroke: TEXT_SECONDARY, strokeWidth: 2, fill: 'none', refX: '50%', refDy: 8, transform: 'translate(-6, 6) scale(0.5)', pointerEvents: 'none' },
  },
  markup: [
    { tagName: 'rect', selector: 'body' },
    { tagName: 'path', selector: 'icon' },
    { tagName: 'text', selector: 'label' },
    { tagName: 'rect', selector: 'addButtonBg' },
    { tagName: 'path', selector: 'addButtonIcon' },
  ],
});
