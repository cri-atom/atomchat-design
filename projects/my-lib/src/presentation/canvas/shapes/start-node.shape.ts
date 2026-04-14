import { dia } from '@joint/plus';
import { BODY_BG, BODY_BORDER, FONT_FAMILY, PORT_COLOR, ICONS } from '../theme';

export const StartNodeShape = dia.Element.define('agentApp.StartNode', {
  size: { width: 140, height: 48 },
  ports: {
    groups: {
      out: {
        position: { name: 'bottom' },
        attrs: { portBody: { fill: PORT_COLOR, stroke: '#F5F5F5', strokeWidth: 4, magnet: true, r: 5, opacity: 0 } },
        size: { width: 10, height: 10 },
        markup: [{ tagName: 'circle', selector: 'portBody' }],
      },
    },
    items: [{ id: 'out-port', group: 'out' }],
  },
  attrs: {
    body: { fill: BODY_BG, stroke: BODY_BORDER, strokeWidth: 1, rx: 24, ry: 24, refWidth: '100%', refHeight: '100%' },
    icon: { d: ICONS.messageSquare, stroke: '#52525C', strokeWidth: 2, fill: 'none', refX: 39, refY: 17, transform: 'scale(0.6)' },
    label: { text: 'INICIO', refX: '58%', refY: '50%', textAnchor: 'middle', textVerticalAnchor: 'middle', fill: '#18181B', fontFamily: FONT_FAMILY, fontSize: 11, fontWeight: '600' },
    addButtonBg: { width: 24, height: 24, rx: 12, ry: 12, fill: '#FFFFFF', stroke: '#E4E4E7', refX: '50%', refDy: 8, x: -12, cursor: 'pointer', event: 'cell:addChild' },
    addButtonIcon: { d: ICONS.plus, stroke: '#71717B', strokeWidth: 2, fill: 'none', refX: '50%', refDy: 8, transform: 'translate(-6, 6) scale(0.5)', pointerEvents: 'none' },
  },
  markup: [
    { tagName: 'rect', selector: 'body' },
    { tagName: 'path', selector: 'icon' },
    { tagName: 'text', selector: 'label' },
    { tagName: 'rect', selector: 'addButtonBg' },
    { tagName: 'path', selector: 'addButtonIcon' },
  ],
});
