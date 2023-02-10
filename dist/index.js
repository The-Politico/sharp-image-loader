"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sharpImageLoader;

var _schemaUtils = require("schema-utils");

var _schema = _interopRequireDefault(require("./schema"));

var _normalizeOptions = _interopRequireDefault(require("./utils/normalizeOptions"));

var _loadImage = _interopRequireDefault(require("./utils/loadImage"));

var _emitFilesAndBuildSource = _interopRequireDefault(require("./utils/emitFilesAndBuildSource"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultOptions = {
  name: '[contenthash].[ext]',
  resizeOriginal: undefined,
  sizes: [],
  squares: false,
  formats: ['avif', 'webp']
};

function sharpImageLoader() {
  const callback = this.async();
  const options = { ...defaultOptions,
    ...this.getOptions()
  };
  (0, _schemaUtils.validate)(_schema.default, options, {
    name: 'Sharp Image Loader',
    baseDataPath: 'options'
  });
  const {
    name,
    resizeOriginal,
    sizes,
    squares,
    tiny,
    formats
  } = (0, _normalizeOptions.default)(options);
  const resourcePath = this.resourcePath;
  const params = new URLSearchParams(this.resourceQuery);
  const resizeOptions = {
    position: params.get('position') || 'centre'
  };
  const esModule = typeof options.esModule !== 'undefined' ? options.esModule : true;
  (0, _loadImage.default)(resourcePath, {
    resizeOriginal,
    sizes,
    squares,
    formats,
    resizeOptions
  }).then(files => {
    return (0, _emitFilesAndBuildSource.default)(this, files, {
      name,
      tiny
    });
  }).then(source => {
    const mod = `${esModule ? 'export default' : 'module.exports ='} ${source}`;
    callback(null, mod);
  }).catch(error => {
    callback(error);
  });
}