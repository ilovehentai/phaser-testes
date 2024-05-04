import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';
import strip from '@rollup/plugin-strip';
import babel from '@rollup/plugin-babel';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import bundleSize from 'rollup-plugin-bundle-size';
import merge from 'deepmerge';
import postcss from 'rollup-plugin-postcss';
import del from 'rollup-plugin-delete';

const baseConfig = {
  plugins: [
    commonjs(),
    typescript(),
    resolve({
      extensions: ['.js', '.ts', '.json'],
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
  ],
};

const addConfig = (componentName, outputTarget, cssTarget) => {
  return {
    ...merge(baseConfig, {
      input: [ componentName ],
      output: {
        file: outputTarget,
        format: 'iife',
        sourcemap: false,
      },
      plugins: [
        postcss({
          extract: cssTarget,
          extensions: ['.css', '.scss'],
          plugins: [
            autoprefixer(),
            cssnano()
          ],
          minimize: true,
          sourceMap: false,
          use: [
            ['sass', {
              includePaths: ['node_modules'],
              outputStyle: 'compressed',
            }]
          ],
        }),
        copy({
          targets: [
            {
              src: `public/js/css`,
              dest: `public/`,
            },
            {
              src: `public`,
              dest: `dist/`,
            },
          ],
          hook: 'writeBundle',
        }),
        del({
          targets: [`public/js/css`, `dist/public/js/css`],
        }),
        bundleSize(),
      ],
    }),
  };
};

export default [
  addConfig('src/game.ts', 'public/js/main.min.js', 'css/styles.css'),
];