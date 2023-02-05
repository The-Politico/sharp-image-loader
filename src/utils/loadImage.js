import sharp from 'sharp';
import loadImageMetadata from './loadImageMetadata';
import resizeImage from './resizeImage';

export default async function loadImage(path, opts = {}) {
  const {
    sizes,
    squares,
    resizeOptions = {},
  } = opts;

  const imageMetadata = await loadImageMetadata(path);

  const imageBuffer = await sharp(path).toBuffer();

  const original = {
    width: imageMetadata.width,
    height: imageMetadata.height,
    content: imageBuffer,
  };
  const imageSizes = await Promise.all(
    sizes.map((size) => resizeImage(path, { size, ...resizeOptions })),
  );
  const imageSquares = await Promise.all(
    squares.map((size) => resizeImage(path, { size, ...resizeOptions })),
  );
  const imageTiny = await resizeImage(path, { size: [40], ...resizeOptions });

  return {
    metadata: imageMetadata,
    original,
    sizes: imageSizes,
    squares: imageSquares,
    tiny: imageTiny,
  };
}
