import { validate } from 'schema-utils';
import schema from './schema';
import normalizeOptions from './utils/normalizeOptions';
import loadImage from './utils/loadImage';
import emitFilesAndBuildSource from './utils/emitFilesAndBuildSource';

const defaultOptions = {
  name: '[contenthash].[ext]',
  resizeOriginal: undefined,
  sizes: [],
  squares: false,
  formats: ['avif', 'webp'],
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
    resizeOriginal,
    sizes,
    squares,
    tiny,
    formats,
  } = normalizeOptions(options);

  const resourcePath = this.resourcePath;
  const params = new URLSearchParams(this.resourceQuery);
  const resizeOptions = {
    position: params.get('position') || 'centre',
  };

  const esModule = (typeof options.esModule !== 'undefined')
    ? options.esModule
    : true

  loadImage(resourcePath, {
    resizeOriginal,
    sizes,
    squares,
    formats,
    resizeOptions,
  })
    .then((files) => {
      return emitFilesAndBuildSource(this, files, { name, tiny });
    })
    .then((source) => {
      const mod = `${esModule ? 'export default' : 'module.exports ='} ${source}`;
      callback(null, mod);
    })
    .catch((error) => {
      callback(error);
    });
}
