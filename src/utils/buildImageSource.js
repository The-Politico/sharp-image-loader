export default function buildImageSource({ url, width, height }) {
  return `{ width: ${JSON.stringify(width)}, height: ${JSON.stringify(height)}, url: ${url} }`;
}
