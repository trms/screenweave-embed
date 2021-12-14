import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import html from 'rollup-plugin-html';
import { terser } from "rollup-plugin-terser";

const config = {
  input: 'src/index.js',
  output: {
    file: 'dist/sw-embed.js',
    format: 'cjs'
  },
  plugins: [
    json(),
    html({ include: '**/*.html' }),
    babel({ babelHelpers: 'bundled' }),
    terser(),
  ]
};

export default config;
