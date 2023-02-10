export default {
  type: 'object',
  properties: {
    name: {
      description: 'The filename template for the target file(s). Use special [image] token for image type label.',
      anyOf: [
        {
          type: 'string'
        },
        {
          instanceof: 'Function'
        }
      ]
    },
    resizeOriginal: {
      description: 'The size (either `[width,height]` or just `width`) to resize the original image to.',
      anyOf: [
        { type: 'integer' },
        {
          type: 'array',
          items: { type: 'integer' },
          maxItems: 2,
          minItems: 1,
        },
      ],
    },
    sizes: {
      description: 'The sizes (either `[width,height]` or just `width`) to resize image.',
      type: 'array',
      items: {
        anyOf: [
          { type: 'integer' },
          {
            type: 'array',
            items: { type: 'integer' },
            maxItems: 2,
            minItems: 1,
          },
        ],
      },
    },
    squares: {
      description: 'Generate square series of cropped image. Specify array of widths or `true` for defaults.',
      anyOf: [
        { type: 'boolean' },
        {
          type: 'array',
          items: { type: 'integer' },
        },
      ],
    },
    tiny: {
      description: 'Generate tiny version to be blurred as a fallback, either as asset or data URI.',
      anyOf: [
        { type: 'boolean' },
        {
          type: 'string',
          pattern: 'data|asset',
        },
      ],
    },
    formats: {
      description: 'Additional image formats to convert original images to',
      anyOf: [
        { type: 'boolean' },
        {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      ],
    },
  },
  additionalProperties: false,
};
