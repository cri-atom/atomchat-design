import { dia } from '@joint/plus';
import { EDGE_DEFAULT, EDGE_SELECTED, EDGE_SUCCESS, EDGE_FAILURE, FONT_FAMILY } from '../theme';

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
    line: { connection: true, fill: 'none', stroke: EDGE_DEFAULT, strokeWidth: 2, targetMarker: { type: 'path', d: 'M 12 -6 0 0 12 6 z', fill: '#71717B', stroke: 'none' } },
    wrapper: { connection: true, strokeWidth: 20, fill: 'none', stroke: 'none', 'pointer-events': 'all' },
  },
  markup: [
    { tagName: 'path', selector: 'wrapper' },
    { tagName: 'path', selector: 'line' },
  ],
  defaultLabel: {
    markup: [
      { tagName: 'rect', selector: 'labelBody' },
      { tagName: 'text', selector: 'labelText' },
    ],
    attrs: {
      labelBody: {
        fill: '#FFFFFF', stroke: '#E4E4E7', rx: 10, ry: 10,
        x: -70, y: -10, width: 110, height: 20,
      },
      labelText: {
        fill: '#52525C', fontFamily: FONT_FAMILY, fontSize: 11, fontWeight: '600',
        textAnchor: 'middle', textVerticalAnchor: 'middle', x: -15,
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
      this.attr('line/targetMarker/fill', '#71717B');
      this.labels([]);
      return;
    }

    const isToolResult = data.conditionType === 'tool_result';
    const hasConditionExpression = typeof data.conditionExpression === 'string';
    const hasError = !isToolResult && hasConditionExpression && !data.conditionExpression.trim();

    let lineColor = EDGE_DEFAULT;
    let bodyFill = '#FFFFFF';
    let bodyStroke = '#E4E4E7';
    let textFill = '#52525C';

    if (isToolResult) {
      if (data.isSuccess === true) {
        lineColor = EDGE_SUCCESS;
        bodyFill = '#F0FDF4';
        bodyStroke = '#86EFAC';
        textFill = '#166534';
      } else if (data.isSuccess === false) {
        lineColor = EDGE_FAILURE;
        bodyFill = '#FEF3F3';
        bodyStroke = '#FCA5A5';
        textFill = '#991B1B';
      }
    } else if (hasError) {
      bodyFill = '#FEF3F3';
      bodyStroke = EDGE_FAILURE;
      textFill = EDGE_FAILURE;
    }

    this.attr('line/stroke', lineColor);
    this.attr('line/targetMarker/fill', lineColor === EDGE_DEFAULT ? '#71717B' : lineColor);

    this.labels([{
      attrs: {
        labelBody: { fill: bodyFill, stroke: bodyStroke },
        labelText: { fill: textFill, text: data.label || 'Condición' },
      },
      position: { distance: 0.5, offset: -14 },
    }]);
  },
});
