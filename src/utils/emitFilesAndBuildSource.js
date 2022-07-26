import emitImage from './emitImage';
import buildImageSource from './buildImageSource';

export default async function emitFilesAndBuildSource(loader, files, opts) {
  const {
    metadata,
    original,
    sizes,
    squares,
  } = files;

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

  return `{${sourceItems.join(', ')}}`;
}
