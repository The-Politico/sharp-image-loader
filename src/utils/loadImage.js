import loadImageMetadata from './loadImageMetadata';
import resizeImage from './resizeImage';

export default async function loadImage(path, opts = {}) {
  const {
    resizeOriginal,
    sizes,
    squares,
    formats,
    resizeOptions = {},
  } = opts;

  const imageMetadata = await loadImageMetadata(path);

  const originalSize = resizeOriginal || [
    imageMetadata.width,
    imageMetadata.height,
  ];
  const [originalImage] = await resizeImage(path, {
    sizes: [originalSize],
    formats: [],
    ...resizeOptions,
  });

  const original = {
    width: originalImage.width,
    height: originalImage.height,
    content: originalImage.content,
  };
  const imageSizes = await resizeImage(path, {
    sizes,
    formats,
    ...resizeOptions,
  });
  const imageSquares = await resizeImage(path, {
    sizes: squares,
    formats,
    ...resizeOptions,
  });
  const [imageTiny] = await resizeImage(path, {
    sizes: [[40]],
    formats: [],
    ...resizeOptions,
  });

  return {
    metadata: imageMetadata,
    original,
    sizes: imageSizes,
    squares: imageSquares,
    tiny: imageTiny,
  };
}
