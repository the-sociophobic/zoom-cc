export default {
  id: {
    type: 'ref',
  },
  APIToken: {
    type: 'string',
    required: true,
    example: "zjhdfboepsDKFB",
  },
  line: {
    type: 'string',
    required: true,
    example: "привет,",
  },
  number: {
    type: 'number',
    required: true,
    example: 0,
  },
  posted: {
    type: 'number',
    example: 1230000,
  }
}