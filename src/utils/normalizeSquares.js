export default function normalizeSquares(squares) {
  if (!squares) return [];
  const widths = Array.isArray(squares) ? squares : [32, 64, 128, 256];
  return widths.map((width) => [width, width]);
}
