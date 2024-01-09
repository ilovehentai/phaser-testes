import resolve from '@rollup/plugin-node-resolve';
import scss from 'rollup-plugin-scss';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';
import strip from '@rollup/plugin-strip';
import babel from '@rollup/plugin-babel';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import * as path from 'path';

export default {
  input: ['src/game.ts'],
  output: {
    file: 'public/js/main.min.js',
    format: 'iife',
    sourcemap: false,
  },
  plugins: [
    commonjs(),
    typescript(),
    resolve({
      extensions: ['.ts', '.json'],
    }),
    terser(),
    strip({
      functions: ['console.log'],
    }),
    babel({
      presets: [['@babel/preset-env', { modules: false }]],
      plugins: ['@babel/plugin-transform-runtime'],
      babelHelpers: 'runtime',
      compact: true,
    }),
    scss({
      sass: require('sass'),
      includePaths: [path.join(__dirname, '../../node_modules/'), 'node_modules/'],
      watch: 'scss',
      output: 'public/css/styles.css',
      processor: () => postcss([autoprefixer(), cssnano()]),
    }),
    copy({
      targets: [
        {
          src: `public`,
          dest: `dist/`,
        },
      ],
      hook: 'writeBundle',
    }),
  ],
};