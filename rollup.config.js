import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';

export default [
  {
    input: './src/server/table.js',
    external: ['ms'],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
    plugins: [
      resolve(),
    ],
  },
];