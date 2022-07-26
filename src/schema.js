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
            minItems: 2,
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
      type: 'string',
      pattern: 'data|asset',
    },
  },
  additionalProperties: false,
};
