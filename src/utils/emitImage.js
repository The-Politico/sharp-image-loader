import path from 'path';
import { interpolateName } from 'loader-utils';
import normalizePath from './normalizePath';

export default function emitImage(loader, image, opts = {}) {
  const {
    width,
    height,
    content,
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

  const publicPath = `__webpack_public_path__ + ${JSON.stringify(url)}`;

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

  loader.emitFile(url, content, null, assetInfo);

  return {
    width,
    height,
    url: publicPath
  };
}
