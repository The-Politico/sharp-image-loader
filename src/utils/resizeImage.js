import sharp from 'sharp';

export default async function resizeImage(path, opts = {}) {
  const {
    size,
  } = opts;

  const [w, h] = size;

  const resized = await sharp(path).resize({
    width: w,
    height: h,
    fit: sharp.fit.cover,
    position: sharp.strategy.attention,
  });
  const content = await resized.toBuffer();
  const { width, height } = await sharp(content).metadata();

  return {
    width,
    height,
    content,
  };
}
