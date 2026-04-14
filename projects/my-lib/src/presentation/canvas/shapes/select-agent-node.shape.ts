import { dia } from '@joint/plus';
import { FONT_FAMILY, PORT_COLOR, SELECT_AGENT_BORDER, ICONS } from '../theme';

export const SelectAgentNodeShape = dia.Element.define('agentApp.SelectAgentNode', {
  size: { width: 180, height: 48 },
  ports: {
    groups: {
      in: { position: { name: 'top' }, attrs: { portBody: { fill: PORT_COLOR, stroke: '#F5F5F5', strokeWidth: 4, opacity: 0, magnet: 'passive', r: 5 } }, size: { width: 10, height: 10 }, markup: [{ tagName: 'circle', selector: 'portBody' }] },
      out: { position: { name: 'bottom' }, attrs: { portBody: { fill: PORT_COLOR, stroke: '#F5F5F5', strokeWidth: 4, opacity: 0, magnet: true, r: 5 } }, size: { width: 10, height: 10 }, markup: [{ tagName: 'circle', selector: 'portBody' }] },
    },
    items: [{ id: 'in-port', group: 'in' }, { id: 'out-port', group: 'out' }],
  },
  attrs: {
    body: { fill: '#FFF', stroke: SELECT_AGENT_BORDER, strokeWidth: 1, strokeDasharray: '6 3', rx: 8, ry: 8, refWidth: '100%', refHeight: '100%' },
    icon: { d: ICONS.users, fill: '#FB2C37', refX: 14, refY: 12, transform: 'scale(0.6)' },
    label: { text: 'Select agent', refX: '55%', refY: '50%', textAnchor: 'middle', textVerticalAnchor: 'middle', fill: '#FB2C37', fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: '600' },
  },
  markup: [
    { tagName: 'rect', selector: 'body' },
    { tagName: 'path', selector: 'icon' },
    { tagName: 'text', selector: 'label' },
  ],
});
