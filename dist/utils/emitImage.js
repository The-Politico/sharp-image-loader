"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = emitImage;

var _path = _interopRequireDefault(require("path"));

var _loaderUtils = require("loader-utils");

var _mimeTypes = _interopRequireDefault(require("mime-types"));

var _normalizePath = _interopRequireDefault(require("./normalizePath"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function emitImage(loader, image, opts = {}) {
  const {
    width,
    height,
    content,
    formats = []
  } = image;
  const {
    name: rawName
  } = opts;
  const imageToken = `${width}w${height}h`;
  const name = typeof rawName === 'string' ? rawName.replace('[image]', imageToken) : rawName;
  const context = loader.rootContext;
  const url = (0, _loaderUtils.interpolateName)(loader, name, {
    context,
    content
  });
  const assetInfo = {};

  if (typeof name === 'string') {
    let normalizedName = name;
    const idx = normalizedName.indexOf('?');

    if (idx >= 0) {
      normalizedName = normalizedName.substr(0, idx);
    }

    const isImmutable = /\[([^:\]]+:)?(hash|contenthash)(:[^\]]+)?]/gi.test(normalizedName);

    if (isImmutable === true) {
      assetInfo.immutable = true;
    }
  }

  assetInfo.sourceFilename = (0, _normalizePath.default)(_path.default.relative(loader.rootContext, loader.resourcePath));

  const getPublicPath = u => `__webpack_public_path__ + ${JSON.stringify(u)}`;

  loader.emitFile(url, content, null, assetInfo);
  const fmts = formats.map(format => {
    const ext = _mimeTypes.default.extension(format.format);

    const formatUrl = `${url}.${ext}`;
    loader.emitFile(formatUrl, format.content, null, assetInfo);
    return {
      format: format.format,
      url: getPublicPath(formatUrl)
    };
  });
  return {
    width,
    height,
    url: getPublicPath(url),
    formats: fmts
  };
}