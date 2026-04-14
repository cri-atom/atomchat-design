import { dia } from '@joint/plus';
import { BODY_BG, BODY_BORDER, FONT_FAMILY, PORT_COLOR, ICONS } from '../theme';

export const EndNodeShape = dia.Element.define('agentApp.EndNode', {
  size: { width: 140, height: 48 },
  ports: {
    groups: {
      in: {
        position: { name: 'top' },
        attrs: { portBody: { fill: PORT_COLOR, stroke: '#F5F5F5', strokeWidth: 4, magnet: 'passive', r: 5, opacity: 0 } },
        size: { width: 10, height: 10 },
        markup: [{ tagName: 'circle', selector: 'portBody' }],
      },
    },
    items: [{ id: 'in-port', group: 'in' }],
  },
  attrs: {
    body: { fill: BODY_BG, stroke: BODY_BORDER, strokeWidth: 1, rx: 24, ry: 24, refWidth: '100%', refHeight: '100%' },
    icon: { d: ICONS.checkCircle, stroke: '#52525C', strokeWidth: 2, fill: 'none', refX: 50, refY: 17, transform: 'scale(0.6)' },
    label: { text: 'FIN', refX: '58%', refY: '50%', textAnchor: 'middle', textVerticalAnchor: 'middle', fill: '#18181B', fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: '700' },
  },
  markup: [
    { tagName: 'rect', selector: 'body' },
    { tagName: 'path', selector: 'icon' },
    { tagName: 'text', selector: 'label' },
  ],
});
