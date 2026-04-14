import { dia, shapes } from '@joint/plus';

export function defineShape(type: string, defaultProps: any): any {
  const ShapeClass = dia.Element.define(type, defaultProps, {
    initialize(args: any) {
      dia.Element.prototype.initialize.call(this, args);
      if (typeof this.onInit === 'function') this.onInit();
    },
  });

  return ShapeClass;
}
