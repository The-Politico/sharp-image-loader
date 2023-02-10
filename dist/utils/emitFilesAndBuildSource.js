"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = emitFilesAndBuildSource;

var _mimeTypes = _interopRequireDefault(require("mime-types"));

var _emitImage = _interopRequireDefault(require("./emitImage"));

var _buildImageSource = _interopRequireDefault(require("./buildImageSource"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function emitFilesAndBuildSource(loader, files, opts) {
  const {
    metadata,
    original,
    sizes,
    squares,
    tiny
  } = files;
  const {
    tiny: tinyFormat
  } = opts;
  const originalImage = await (0, _emitImage.default)(loader, original, opts);
  const originalSource = (0, _buildImageSource.default)(originalImage);
  const sizesSource = await Promise.all(sizes.map(async size => {
    const sizeImage = await (0, _emitImage.default)(loader, size, opts);
    return (0, _buildImageSource.default)(sizeImage);
  }));
  const squaresSource = await Promise.all(squares.map(async square => {
    const squareImage = await (0, _emitImage.default)(loader, square, opts);
    return (0, _buildImageSource.default)(squareImage);
  }));
  const sourceItems = [`metadata: ${JSON.stringify(metadata)}`, `src: ${originalImage.url}`, `original: ${originalSource}`, `sizes: [${sizesSource.join(', ')}]`, `squares: [${squaresSource.join(', ')}]`];

  if (tinyFormat) {
    const mimeType = _mimeTypes.default.lookup(metadata.format);

    const tinyUrl = tinyFormat === 'asset' ? (await (0, _emitImage.default)(loader, tiny, opts)).url : `data:${mimeType};base64,${tiny.content.toString('base64')}`;
    sourceItems.push(`tiny: ${JSON.stringify(tinyUrl)}`);
  }

  return `{${sourceItems.join(', ')}}`;
}