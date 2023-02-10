"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = normalizeOptions;

function normalizeSize(size) {
  if (typeof size === 'undefined') return size;
  if (Array.isArray(size)) return size;
  return [size];
}

function normalizeSquares(squares) {
  if (!squares) return [];
  const widths = Array.isArray(squares) ? squares : [32, 64, 128, 256];
  return widths.map(width => [width, width]);
}

function normalizeTiny(tiny) {
  if (typeof tiny === 'string') return tiny;
  return !!tiny && 'data';
}

function normalizeFormats(formats) {
  if (!formats) return [];
  if (Array.isArray(formats)) return formats;
  return ['avif', 'webp'];
}

function normalizeOptions(opts = {}) {
  const {
    resizeOriginal,
    sizes,
    squares,
    tiny,
    formats,
    ...restOpts
  } = opts;
  return {
    resizeOriginal: normalizeSize(resizeOriginal),
    sizes: sizes.map(normalizeSize),
    squares: normalizeSquares(squares),
    tiny: normalizeTiny(tiny),
    formats: normalizeFormats(formats),
    ...restOpts
  };
}