"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resizeImage;

var _sharp = _interopRequireDefault(require("sharp"));

var _mimeTypes = _interopRequireDefault(require("mime-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function resizeImage(path, opts = {}) {
  const {
    sizes,
    position,
    formats = ['avif', 'webp']
  } = opts;
  const pipeline = await (0, _sharp.default)(path);
  const resizes = await Promise.all(sizes.map(async ([w, h]) => {
    const resized = await pipeline.clone().resize({
      width: w,
      height: h,
      fit: _sharp.default.fit.cover,
      position
    });
    const fmts = await Promise.all(formats.map(async fmt => {
      const fmtContent = await resized.clone().rotate().toFormat(fmt).toBuffer();
      return {
        format: _mimeTypes.default.lookup(fmt),
        content: fmtContent
      };
    }));
    const content = await resized.clone().rotate().toBuffer();
    const {
      width,
      height
    } = await (0, _sharp.default)(content).metadata();
    return {
      width,
      height,
      content,
      formats: fmts
    };
  }));
  return resizes;
}