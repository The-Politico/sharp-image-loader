"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildImageSource;

function buildImageSource({
  url,
  width,
  height,
  formats
}) {
  const w = JSON.stringify(width);
  const h = JSON.stringify(height);
  const f = formats.map(({
    format,
    url
  }) => `{ format: ${JSON.stringify(format)}, url: ${url} }`);
  const fs = `[${f.join(', ')}]`;
  return `{ width: ${w}, height: ${h}, url: ${url}, formats: ${fs} }`;
}