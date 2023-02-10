"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadImageMetadata;

var _sharp = _interopRequireDefault(require("sharp"));

var _rgbToHex = _interopRequireDefault(require("./rgbToHex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function loadImageMetadata(path) {
  const image = (0, _sharp.default)(path);
  const {
    format,
    width,
    height
  } = await image.metadata();
  const {
    dominant
  } = await image.stats();
  return {
    width,
    height,
    format,
    color: (0, _rgbToHex.default)(dominant)
  };
}