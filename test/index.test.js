/**
 * @jest-environment node
 */
import compiler from './compiler.js';

test('Generates original image', async () => {
  const stats = await compiler('./images/sharp.js');
  const webpackStats = stats.toJson({ source: true });
  const mainModule = webpackStats.modules[0];

  expect(mainModule.assets.length).toBe(1);
});

test('Generates original image plus one size', async () => {
  const stats = await compiler('./images/sharp.js', { sizes: [200] });
  const webpackStats = stats.toJson({ source: true });
  const mainModule = webpackStats.modules[0];

  expect(mainModule.assets.length).toBe(2);
});

test('Generates original image plus one size and one square', async () => {
  const stats = await compiler('./images/sharp.js', {
    sizes: [200],
    squares: [64],
  });
  const webpackStats = stats.toJson({ source: true });
  const mainModule = webpackStats.modules[0];

  expect(mainModule.assets.length).toBe(3);
});

test('Respects name option', async () => {
  const stats = await compiler('./images/sharp.js', {
    name: 'images/[name]/[image].[ext]',
  });
  const webpackStats = stats.toJson({ source: true });
  const mainModule = webpackStats.modules[0];

  const assetName = mainModule.assets[0];

  expect(assetName).toBe('images/sharp/1280w640h.png');
});

test('Respects name option with multiple sizes', async () => {
  const stats = await compiler('./images/sharp.js', {
    name: 'images/[name]/[image].[ext]',
    sizes: [100, 200],
    squares: [64],
  });
  const webpackStats = stats.toJson({ source: true });
  const mainModule = webpackStats.modules[0];

  const assetNames = mainModule.assets;

  expect(assetNames).toContain('images/sharp/1280w640h.png');
  expect(assetNames).toContain('images/sharp/200w100h.png');
  expect(assetNames).toContain('images/sharp/100w50h.png');
  expect(assetNames).toContain('images/sharp/64w64h.png');
});

test('Generates a tiny asset', async () => {
  const stats = await compiler('./images/sharp.js', {
    name: 'images/[name]/[image].[ext]',
    tiny: 'asset',
  });
  const webpackStats = stats.toJson({ source: true });
  const mainModule = webpackStats.modules[0];

  const assetNames = mainModule.assets;

  expect(assetNames).toContain('images/sharp/40w20h.png');
});

test('Generates a tiny data URI', async () => {
  const stats = await compiler('./images/sharp.js', {
    name: 'images/[name]/[image].[ext]',
    tiny: 'data',
  });
  const webpackStats = stats.toJson({ source: true });
  const mainModule = webpackStats.modules[0];

  const assetNames = mainModule.assets;

  expect(assetNames.length).toBe(1);
});
