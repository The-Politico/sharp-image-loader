export default function rgbToHex({ r, g, b }) {
  const hexCodes = [r, g, b].map((n) => n.toString(16).padStart(2, '0'));
  return `#${hexCodes.join('')}`;
}
