import { validate } from 'schema-utils';
import schema from './schema';
import normalizeSquares from './utils/normalizeSquares';
import loadImage from './utils/loadImage';
import emitFilesAndBuildSource from './utils/emitFilesAndBuildSource';

const defaultOptions = {
  name: '[contenthash].[ext]',
  sizes: [],
  squares: false,
};

export default function sharpImageLoader() {
  const callback = this.async();

  const options = {
    ...defaultOptions,
    ...this.getOptions(),
  };

  validate(schema, options, {
    name: 'Sharp Image Loader',
    baseDataPath: 'options',
  });

  const {
    name,
    sizes: rawSizes,
    squares: rawSquares,
    tiny,
  } = options;

  const sizes = rawSizes.map((size) => Array.isArray(size) ? size : [size]);
  const squares = normalizeSquares(rawSquares);

  const resourcePath = this.resourcePath;

  const esModule = (typeof options.esModule !== 'undefined')
    ? options.esModule
    : true

  loadImage(resourcePath, { name, sizes, squares, tiny })
    .then((files) => {
      return emitFilesAndBuildSource(this, files, { name });
    })
    .then((source) => {
      const mod = `${esModule ? 'export default' : 'module.exports ='} ${source}`;
      callback(null, mod);
    })
    .catch((error) => {
      callback(error);
    });
}
