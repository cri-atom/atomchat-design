import { dia } from '@joint/plus';
import {
  BODY_BG,
  BODY_BORDER,
  EDGE_DEFAULT,
  EDGE_FAILURE,
  EDGE_SUCCESS,
  ERROR_BG,
  FONT_FAMILY,
  ICONS,
  PORT_COLOR,
  SUCCESS_BG,
  TEXT_PRIMARY,
} from '../theme';

const DEFAULT_CONDITION_LABEL = 'Condición';
const MAX_CONDITION_LABEL_CHARS = 12;

function getRenderableConditionLabel(value: unknown): string {
  const label = typeof value === 'string' ? value.trim() : '';
  if (!label) return DEFAULT_CONDITION_LABEL;
  if (label.length <= MAX_CONDITION_LABEL_CHARS) return label;
  return `${label.slice(0, MAX_CONDITION_LABEL_CHARS - 3)}...`;
}

export const ConditionEdgeLinkView = (dia.LinkView as any).extend({
  render(this: any) {
    (dia.LinkView.prototype as any).render.call(this);
    this._bringLabelsToFront();
    return this;
  },
  updateLabels(this: any) {
    (dia.LinkView.prototype as any).updateLabels?.call(this);
    this._bringLabelsToFront();
  },
  _bringLabelsToFront(this: any) {
    const labelsEl: Element | null = this.el.querySelector('.labels');
    if (labelsEl) this.el.appendChild(labelsEl);
  },
});

export const ConditionEdgeLink = dia.Link.define('agentApp.Link', {
  z: -1,
  connector: { name: 'curve', args: { sourceDirection: 'down', targetDirection: 'up' } },
  attrs: {
    line: { connection: true, fill: 'none', stroke: EDGE_DEFAULT, strokeWidth: 2, targetMarker: { type: 'path', d: 'M 8 -4 0 0 8 4 z', fill: PORT_COLOR, stroke: 'none' } },
    wrapper: { connection: true, strokeWidth: 20, fill: 'none', stroke: 'none', 'pointer-events': 'all' },
  },
  markup: [
    { tagName: 'path', selector: 'wrapper' },
    { tagName: 'path', selector: 'line' },
  ],
  defaultLabel: {
    markup: [
      { tagName: 'rect', selector: 'labelBody' },
      { tagName: 'path', selector: 'labelIcon' },
      { tagName: 'text', selector: 'labelText' },
    ],
    attrs: {
      labelBody: {
        fill: BODY_BG, stroke: BODY_BORDER, rx: 10, ry: 10,
        x: -74, y: -20, width: 128, height: 40,
      },
      labelIcon: {
        d: ICONS.condition,
        fill: TEXT_PRIMARY,
        stroke: 'none',
        transform: 'translate(-60 -6) scale(1)',
      },
      labelText: {
        fill: TEXT_PRIMARY, fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: '500',
        textAnchor: 'middle', textVerticalAnchor: 'middle', x: -4,
      },
    },
    position: { distance: 0.5, offset: -14 },
  },
}, {
  initialize(this: any, ...args: any[]) {
    dia.Link.prototype.initialize.apply(this, args);
    this.on('change:edgeData', () => this.updateAppearance());
    this.updateAppearance();
  },

  updateAppearance(this: any): void {
    const data = this.get('edgeData') || {};

    if (data.conditionType === null || data.conditionType === undefined) {
      this.attr('line/stroke', EDGE_DEFAULT);
      this.attr('line/targetMarker/fill', PORT_COLOR);
      this.labels([]);
      return;
    }

    const isToolResult = data.conditionType === 'tool_result';
    const hasConditionExpression = typeof data.conditionExpression === 'string';
    const hasError = !isToolResult && hasConditionExpression && !data.conditionExpression.trim();

    let lineColor = EDGE_DEFAULT;
    let bodyFill = BODY_BG;
    let bodyStroke = BODY_BORDER;
    const textFill = TEXT_PRIMARY;

    if (isToolResult) {
      if (data.isSuccess === true) {
        lineColor = EDGE_SUCCESS;
        bodyFill = SUCCESS_BG;
        bodyStroke = EDGE_SUCCESS;
      } else if (data.isSuccess === false) {
        lineColor = EDGE_FAILURE;
        bodyFill = ERROR_BG;
        bodyStroke = EDGE_FAILURE;
      }
    } else if (hasError) {
      bodyFill = ERROR_BG;
      bodyStroke = EDGE_FAILURE;
    }

    this.attr('line/stroke', lineColor);
    this.attr('line/targetMarker/fill', lineColor === EDGE_DEFAULT ? PORT_COLOR : lineColor);

    const conditionLabel = getRenderableConditionLabel(data.label);

    this.labels([{
      attrs: {
        labelBody: { fill: bodyFill, stroke: bodyStroke },
        labelIcon: { fill: textFill },
        labelText: {
          fill: textFill,
          text: conditionLabel,
        },
      },
      position: { distance: 0.5, offset: -14 },
    }]);
  },
});
