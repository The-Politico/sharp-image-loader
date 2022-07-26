import sharp from 'sharp';
import rgbToHex from './rgbToHex';

export default async function loadImageMetadata(path) {
  const image = sharp(path);
  const { width, height } = await image.metadata();
  const { dominant } = await image.stats();
  return {
    width,
    height,
    color: rgbToHex(dominant),
  };
}
