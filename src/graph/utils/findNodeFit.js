import Config from '../Config'

export default function findNodeFit (node, width, height) {
  var limits = {
    minX: node.metadata.x - Config.base.config.nodeSize,
    minY: node.metadata.y - Config.base.config.nodeSize,
    maxX: node.metadata.x + Config.base.config.nodeSize * 2,
    maxY: node.metadata.y + Config.base.config.nodeSize * 2
  };

  var gWidth = limits.maxX - limits.minX;
  var gHeight = limits.maxY - limits.minY;

  var scaleX = width / gWidth;
  var scaleY = height / gHeight;

  var scale, x, y;
  if (scaleX < scaleY) {
    scale = scaleX;
    x = 0 - limits.minX * scale;
    y = 0 - limits.minY * scale + (height-(gHeight*scale))/2;
  } else {
    scale = scaleY;
    x = 0 - limits.minX * scale + (width-(gWidth*scale))/2;
    y = 0 - limits.minY * scale;
  }

  return {
    x: x,
    y: y,
    scale: scale
  };
};
