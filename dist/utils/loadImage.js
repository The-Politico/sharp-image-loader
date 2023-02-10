"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadImage;

var _loadImageMetadata = _interopRequireDefault(require("./loadImageMetadata"));

var _resizeImage = _interopRequireDefault(require("./resizeImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function loadImage(path, opts = {}) {
  const {
    resizeOriginal,
    sizes,
    squares,
    formats,
    resizeOptions = {}
  } = opts;
  const imageMetadata = await (0, _loadImageMetadata.default)(path);
  const originalSize = resizeOriginal || [imageMetadata.width, imageMetadata.height];
  const [originalImage] = await (0, _resizeImage.default)(path, {
    sizes: [originalSize],
    formats: [],
    ...resizeOptions
  });
  const original = {
    width: originalImage.width,
    height: originalImage.height,
    content: originalImage.content
  };
  const imageSizes = await (0, _resizeImage.default)(path, {
    sizes,
    formats,
    ...resizeOptions
  });
  const imageSquares = await (0, _resizeImage.default)(path, {
    sizes: squares,
    formats,
    ...resizeOptions
  });
  const [imageTiny] = await (0, _resizeImage.default)(path, {
    sizes: [[40]],
    formats: [],
    ...resizeOptions
  });
  return {
    metadata: imageMetadata,
    original,
    sizes: imageSizes,
    squares: imageSquares,
    tiny: imageTiny
  };
}