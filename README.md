sharp-webpack-loader
====================

A webpack loader for dynamically optimizing and resizing images at build time
with [Sharp][].

## Options

- `name` is the webpack asset file name template to use for generated images.
  It accepts the same template tokens as your typical webpack asset name plus
  `[image]`, which is a token containing the dimensions of the generated image.
  Example:
  ```js
  {
    test: /\.(png|jpg|jpeg|webp|avif)$/i,
    loader: 'sharp-image-loader',
    options: {
      name: 'static/images/[name]/[image].[contenthash].[ext]',
    },
  }
  ```
  The default value is `[contenthash].[ext]`.

- `resizeOriginal` is can be a width or pair of dimensions to which the loader
  should resize the original image. The loader will always include the original
  image in the final build ass a fall-back, but if you're dealing with
  extremely hi-resolution original images it may be helpful to resize them to
  a more manageable size. The dimensions can either be specified as an array of
  `[width, height]`, an array of just `[width]`, or even just a number `width`
  as a convenience. If only `width` is provided the `height` will be derived
  from the aspect ratio of the original image. Example:
  ```js
  {
    test: /\.(png|jpg|jpeg|webp|avif)$/i,
    loader: 'sharp-image-loader',
    options: {
      resizeOriginal: [2000],
    },
  }
  ```
  The default value is `undefined`, meaning that the original will not be
  resized at all.

- `sizes` is an array of dimensions to which the image should be resized for
  display at various widths. Each size can be specified in the same ways as
  `resizeOriginal`. Example:
  ```js
  {
    test: /\.(png|jpg|jpeg|webp|avif)$/i,
    loader: 'sharp-image-loader',
    options: {
      sizes: [420, 768, 1280, 2000],
    },
  }
  ```
  That will give you four size options at the specified widths with the
  corresponding heights following the original image's aspect ratio. The
  default value is `[]`, meaning that no additional sizes of the image will be
  created.

- `squares` is an array of widths at which square thumbnail crops of the image
  should be made. Example:
  ```js
  {
    test: /\.(png|jpg|jpeg|webp|avif)$/i,
    loader: 'sharp-image-loader',
    options: {
      squares: [32, 64, 128, 256],
    },
  }
  ```
  The default value is `false`, meaning no square crops will be made.

- `tiny` can either be set to one of the strings `data` or `asset`. This
  specifies how to include a "tiny" version of the image for blurring purposes.
  When set to `data` the loader will include a data URI of the tiny image,
  which can be good for a blurred pre-load fallback because it won't require an
  additional web request. If set to `asset` the tiny image will be included as
  a standard image asset. Example:
  ```js
  {
    test: /\.(png|jpg|jpeg|webp|avif)$/i,
    loader: 'sharp-image-loader',
    options: {
      tiny: 'data',
    },
  }
  ```
  The default value is `undefined`, meaning that no tiny version of the image
  will be created. You can also set this to `true` (in which case a data URI is
  created) or `false` (in which case no tiny image is created) as
  a convenience.

- `formats` is an array of additional image formats that the image should be
  converted into at the various sizes specified. Each format must be [an image
  format supported by Sharp][sharp-toFormat]. Example:
  ```js
  {
    test: /\.(png|jpg|jpeg|webp|avif)$/i,
    loader: 'sharp-image-loader',
    options: {
      formats: ['avif'],
    },
  }
  ```
  The default value is `['avif', 'webp']`, which means that each size of the
  image will be produced in both `avif` and `webp` formats in addition to the
  original format of the image. You can also set this to `[]` or `false`, in
  which case no additional formats will be created. Note that only the new
  sizes are reformatted; the "original" version is not reformatted whether it
  is resized or not.

## Asset query parameters

Some per-asset information can be passed to the loader using query parameters
on the import path of the asset. Example:

```js
import myImage from './images/my-image.jpg?position=left';
```

The following query parameters are supported:

- `position` specifies the "focal point" of the image. The loader uses [Sharp's
  `cover` strategy for resizing images][sharp-cover], so when an image is
  resized to a new aspect ratio some of the image is cropped off. The
  `position` of the image determines what section of the image is prioritized
  in the crop. Note that if you are only resizing images following their
  original aspect ratios then this option will have no effect.

[Sharp]: https://sharp.pixelplumbing.com/
[sharp-toFormat]: https://sharp.pixelplumbing.com/api-output#toformat
[sharp-cover]: https://sharp.pixelplumbing.com/api-resize#resize
