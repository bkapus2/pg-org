import pkg from './package.json';

export default [
  {
    input: './src/server/table.js',
    external: ['ms'],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
  },
];