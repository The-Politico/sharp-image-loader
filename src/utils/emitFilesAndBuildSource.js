import mime from 'mime-types';
import emitImage from './emitImage';
import buildImageSource from './buildImageSource';

export default async function emitFilesAndBuildSource(loader, files, opts) {
  const {
    metadata,
    original,
    sizes,
    squares,
    tiny,
  } = files;

  const {
    tiny: tinyFormat,
  } = opts;

  const originalImage = await emitImage(loader, original, opts);
  const originalSource = buildImageSource(originalImage);
  const sizesSource = await Promise.all(sizes.map(async (size) => {
    const sizeImage = await emitImage(loader, size, opts);
    return buildImageSource(sizeImage);
  }));
  const squaresSource = await Promise.all(squares.map(async (square) => {
    const squareImage = await emitImage(loader, square, opts);
    return buildImageSource(squareImage);
  }));

  const sourceItems = [
    `metadata: ${JSON.stringify(metadata)}`,
    `original: ${originalSource}`,
    `sizes: [${sizesSource.join(', ')}]`,
    `squares: [${squaresSource.join(', ')}]`,
  ];

  if (tinyFormat) {
    const mimeType = mime.lookup(metadata.format);
    const tinyUrl = (tinyFormat === 'asset')
      ? (await emitImage(loader, tiny, opts)).url
      : `data:${mimeType};base64,${tiny.content.toString('base64')}`
    sourceItems.push(`tiny: ${JSON.stringify(tinyUrl)}`);
  }

  return `{${sourceItems.join(', ')}}`;
}
