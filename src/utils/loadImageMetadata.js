import sharp from 'sharp';
import rgbToHex from './rgbToHex';

export default async function loadImageMetadata(path) {
  const image = sharp(path);
  const { format, width, height } = await image.metadata();
  const { dominant } = await image.stats();
  return {
    width,
    height,
    format,
    color: rgbToHex(dominant),
  };
}
