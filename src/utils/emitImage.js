import path from 'path';
import { interpolateName } from 'loader-utils';
import mime from 'mime-types';
import normalizePath from './normalizePath';

export default function emitImage(loader, image, opts = {}) {
  const {
    width,
    height,
    content,
    formats = [],
  } = image;

  const {
    name: rawName,
  } = opts;

  const imageToken = `${width}w${height}h`;

  const name = (typeof rawName === 'string')
    ? rawName.replace('[image]', imageToken)
    : rawName;

  const context = loader.rootContext;
  const url = interpolateName(loader, name, {
    context,
    content,
  });

  const assetInfo = {};

  if (typeof name === 'string') {
    let normalizedName = name;

    const idx = normalizedName.indexOf('?');

    if (idx >= 0) {
      normalizedName = normalizedName.substr(0, idx);
    }

    const isImmutable = /\[([^:\]]+:)?(hash|contenthash)(:[^\]]+)?]/gi.test(
      normalizedName
    );

    if (isImmutable === true) {
      assetInfo.immutable = true;
    }
  }

  assetInfo.sourceFilename = normalizePath(
    path.relative(loader.rootContext, loader.resourcePath)
  );

  const getPublicPath = (u) => `__webpack_public_path__ + ${JSON.stringify(u)}`;

  loader.emitFile(url, content, null, assetInfo);
  const fmts = formats.map((format) => {
    const ext = mime.extension(format.format);
    const formatUrl = `${url}.${ext}`;
    loader.emitFile(formatUrl, format.content, null, assetInfo);
    return {
      format: format.format,
      url: getPublicPath(formatUrl),
    };
  });

  return {
    width,
    height,
    url: getPublicPath(url),
    formats: fmts,
  };
}
