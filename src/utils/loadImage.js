import sharp from 'sharp';
import loadImageMetadata from './loadImageMetadata';
import resizeImage from './resizeImage';

export default async function loadImage(path, opts = {}) {
  const {
    name,
    sizes,
    squares,
    tiny,
  } = opts;

  const imageMetadata = await loadImageMetadata(path);

  const imageBuffer = await sharp(path).toBuffer();

  const original = {
    width: imageMetadata.width,
    height: imageMetadata.height,
    content: imageBuffer,
  };
  const imageSizes = await Promise.all(
    sizes.map((size) => resizeImage(path, { size })),
  );
  const imageSquares = await Promise.all(
    squares.map((size) => resizeImage(path, { size })),
  );

  return {
    metadata: imageMetadata,
    original,
    sizes: imageSizes,
    squares: imageSquares,
  };
}
