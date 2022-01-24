import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import html from 'rollup-plugin-html';
import { terser } from "rollup-plugin-terser";
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import css from "rollup-plugin-import-css";
import ignore from "rollup-plugin-ignore";

const config = {
  input: 'src/index.js',
  output: {
    file: 'dist/sw-embed.js',
    format: 'iife'
  },
  plugins: [
    ignore(["video.js"]),
    json(),
    html({ include: '**/*.html' }),
    css(),
    resolve(),
    commonjs({ include: 'node_modules/**' }),
    babel({ babelHelpers: 'bundled' }),
    terser(),
  ]
};

export default config;
