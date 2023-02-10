import sharp from 'sharp';
import mime from 'mime-types';

export default async function resizeImage(path, opts = {}) {
  const {
    sizes,
    position,
    formats = ['avif', 'webp'],
  } = opts;

  const pipeline = await sharp(path);

  const resizes = await Promise.all(sizes.map(async ([w, h]) => {
    const resized = await pipeline.clone().resize({
      width: w,
      height: h,
      fit: sharp.fit.cover,
      position,
    });
    const fmts = await Promise.all(formats.map(async (fmt) => {
      const fmtContent = await resized
        .clone()
        .rotate()
        .toFormat(fmt)
        .toBuffer();
      return {
        format: mime.lookup(fmt),
        content: fmtContent,
      };
    }));
    const content = await resized.clone().rotate().toBuffer();
    const { width, height } = await sharp(content).metadata();
    return {
      width,
      height,
      content,
      formats: fmts,
    };
  }));

  return resizes;
}
