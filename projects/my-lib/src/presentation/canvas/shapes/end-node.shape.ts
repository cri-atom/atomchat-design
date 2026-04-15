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
} from '../theme';

export const EndNodeShape = dia.Element.define('agentApp.EndNode', {
  size: { width: 100, height: 40 },
  ports: {
    groups: {
      in: {
        position: { name: 'top' },
        attrs: { portBody: { fill: PORT_COLOR, stroke: PORT_STROKE, strokeWidth: 4, magnet: true, r: 5, opacity: 0 } },
        size: { width: 10, height: 10 },
        markup: [{ tagName: 'circle', selector: 'portBody' }],
      },
    },
    items: [{ id: 'in-port', group: 'in' }],
  },
  attrs: {
    body: { fill: BODY_BG, stroke: BODY_BORDER, strokeWidth: 1, rx: 8, ry: 8, refWidth: '100%', refHeight: '100%' },
    icon: { d: ICONS.fin, stroke: 'none', fill: TEXT_MUTED, refX: 20, refY: 12, transform: 'scale(1)' },
    label: { text: 'FIN', refX: '58%', refY: '50%', textAnchor: 'middle', textVerticalAnchor: 'middle', fill: TEXT_PRIMARY, fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: '600' },
  },
  markup: [
    { tagName: 'rect', selector: 'body' },
    { tagName: 'path', selector: 'icon' },
    { tagName: 'text', selector: 'label' },
  ],
});
